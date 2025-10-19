// server/bot.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем .env из корня проекта
dotenv.config({ path: join(__dirname, '..', '.env') });

// === 🔑 Настройки ===
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_IDS = process.env.ADMIN_TELEGRAM_IDS
  ? process.env.ADMIN_TELEGRAM_IDS.split(',').map(id => Number(id.trim()))
  : [];

const PORT = 3001;

if (!TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN не задан в .env');
  process.exit(1);
}

// === 🗃️ База данных ===
const dbPath = join(__dirname, 'applications.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      contact TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT,
      size TEXT,
      comment TEXT,
      status TEXT DEFAULT 'новая',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run('CREATE INDEX IF NOT EXISTS idx_status ON applications(status)');
  db.run('CREATE INDEX IF NOT EXISTS idx_type ON applications(type)');
  db.run('CREATE INDEX IF NOT EXISTS idx_type_status ON applications(type, status)');
});

// === 🤖 Telegram бот ===
let bot = null;
try {
  const { default: TelegramBot } = await import('node-telegram-bot-api');
  bot = new TelegramBot(TOKEN, { polling: true });

  bot.on('polling_error', (error) => {
    console.error('🚨 Telegram polling error:', error.message);
  });
} catch (err) {
  console.error('❌ Не удалось запустить Telegram бота:', err.message);
}

// === Вспомогательные функции ===
function getEmoji(status) {
  const map = {
    'новая': '🔴 новая',
    'в работе': '🟡 в работе',
    'завершена': '✅ завершена',
    'отклонена': '❌ отклонена'
  };
  return map[status] || status;
}

function notifyAdmins(app) {
  if (!bot) return;

  const { id, type, contact, phone, city, size, comment } = app;
  let message = '';

  if (type === 'cups') {
    message = `🥤 Бесплатные стаканчики\n🆕 Заявка #${id}\nКонтакт: ${contact}\nГород: ${city}\nТелефон: ${phone}`;
  } else if (type === 'brand') {
    message = `🏢 Заявка для бренда\n🆕 Заявка #${id}\nКонтакт: ${contact}\nТелефон: ${phone}\nРазмер: ${size || '—'}\nКомментарий: ${comment || '—'}`;
  }

  message += `\nСтатус: ${getEmoji('новая')}`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '✅ В работе', callback_data: `status:${id}:в работе` }],
      [{ text: '❌ Отклонена', callback_data: `status:${id}:отклонена` }],
      [{ text: '✔️ Завершена', callback_data: `status:${id}:завершена` }]
    ]
  };

  ADMIN_IDS.forEach(id => {
    bot.sendMessage(id, message, { reply_markup: keyboard }).catch(console.error);
  });
}

// === 📋 Справка и клавиатура при /start ===
if (bot) {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
👋 *Привет! Я бот для управления заявками.*

📋 *Основные команды:*
• /заявки — активные заявки (новые + в работе)
• /заявки новые — только новые
• /заявки в работе — только в работе
• /заявки завершённые — завершённые
• /заявки стаканчики — бесплатные стаканчики
• /заявки бренд — заявки от брендов

💡 После отправки заявки вы получите уведомление с кнопками для быстрого изменения статуса.
    `;

    const keyboard = {
      keyboard: [
        ['/заявки', '/заявки новые'],
        ['/заявки стаканчики', '/заявки бренд'],
        ['/заявки завершённые', '/заявки в работе']
      ],
      resize_keyboard: true
    };

    bot.sendMessage(chatId, helpMessage.trim(), {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });
  });
}

// === 📋 Функция с пагинацией ===
function handleApplicationsCommand(msg, match, page = 1) {
  const userId = msg.from.id;
  const filter = (match[2] || '').trim().toLowerCase();
  let baseQuery = `SELECT id, type, contact, phone, status FROM applications`;
  let countQuery = `SELECT COUNT(*) as total FROM applications`;
  let params = [];
  let desc = '';

  if (['стаканчики', 'cups'].some(w => filter.includes(w))) {
    baseQuery += ' WHERE type = ?';
    countQuery += ' WHERE type = ?';
    params.push('cups');
    desc = ' (стаканчики)';
  } else if (['бренд', 'brand'].some(w => filter.includes(w))) {
    baseQuery += ' WHERE type = ?';
    countQuery += ' WHERE type = ?';
    params.push('brand');
    desc = ' (бренды)';
  }

  const statusFilters = [
    { keywords: ['новые'], value: 'новая' },
    { keywords: ['в работе'], value: 'в работе' },
    { keywords: ['завершённые', 'завершенные'], value: 'завершена' },
    { keywords: ['отклонённые', 'отклоненные'], value: 'отклонена' }
  ];

  let statusFilter = null;
  for (const { keywords, value } of statusFilters) {
    if (keywords.some(kw => filter.includes(kw))) {
      statusFilter = value;
      desc += ` + статус "${keywords[0]}"`;
      break;
    }
  }

  if (statusFilter) {
    baseQuery += params.length ? ' AND status = ?' : ' WHERE status = ?';
    countQuery += params.length ? ' AND status = ?' : ' WHERE status = ?';
    params.push(statusFilter);
  }

  if (filter === '' && statusFilter === null && !desc) {
    baseQuery += " WHERE status IN ('новая', 'в работе')";
    countQuery += " WHERE status IN ('новая', 'в работе')";
    desc = ' (активные)';
  }

  const LIMIT = 5;
  const OFFSET = (page - 1) * LIMIT;

  db.get(countQuery, params, (err, countRow) => {
    if (err) return bot.sendMessage(userId, '❌ Ошибка подсчёта заявок');
    const total = countRow.total;
    const totalPages = Math.ceil(total / LIMIT);

    if (total === 0) {
      return bot.sendMessage(userId, `📭 Нет заявок${desc}.`);
    }

    db.all(`${baseQuery} ORDER BY id DESC LIMIT ${LIMIT} OFFSET ${OFFSET}`, params, (err, rows) => {
      if (err || rows.length === 0) {
        return bot.sendMessage(userId, `📭 Нет заявок на странице ${page}${desc}.`);
      }

      const list = rows.map(row =>
        `#${row.id} [${row.type === 'brand' ? '🏢' : '🥤'}] — ${row.contact} — ${getEmoji(row.status)}`
      ).join('\n');

      const selectButtons = rows.map(row => ({
        text: `#${row.id}`,
        callback_data: `select:${row.id}`
      }));

      const inline_keyboard = [];
      for (let i = 0; i < selectButtons.length; i += 3) {
        inline_keyboard.push(selectButtons.slice(i, i + 3));
      }

      const navRow = [];
      if (page > 1) {
        navRow.push({ text: '⬅️ Назад', callback_data: `page:${page - 1}:${filter}` });
      }
      navRow.push({ text: `${page}/${totalPages}`, callback_data: 'noop' });
      if (page < totalPages) {
        navRow.push({ text: 'Вперёд ➡️', callback_data: `page:${page + 1}:${filter}` });
      }
      inline_keyboard.push(navRow);

      const messageText = `📋 Заявки${desc} (стр. ${page}/${totalPages}):\n\n${list}\n\n👉 Выберите заявку или листайте страницы:`;

      bot.sendMessage(userId, messageText, {
        reply_markup: { inline_keyboard }
      });
    });
  });
}

// === 📋 Команды /заявки ===
if (bot) {
  bot.onText(/^(\/заявки|\/applications)$/, (msg) => {
    handleApplicationsCommand(msg, { 2: '' }, 1);
  });

  bot.onText(/^(\/заявки|\/applications)\s+(.+)$/i, (msg, match) => {
    const userId = msg.from.id;
    if (!ADMIN_IDS.includes(userId)) {
      return bot.sendMessage(userId, '🚫 Доступ запрещён.');
    }
    handleApplicationsCommand(msg, match, 1);
  });
}

// === 🔄 Обработка inline-кнопок ===
if (bot) {
  bot.on('callback_query', (query) => {
    const data = query.data;
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    // Пагинация — удаляем и отправляем новое
    if (data.startsWith('page:')) {
      bot.deleteMessage(chatId, messageId).catch(() => {});
      const [, newPage, filter] = data.split(':');
      const fakeMsg = { from: { id: userId }, chat: { id: userId } };
      handleApplicationsCommand(fakeMsg, { 2: filter || '' }, parseInt(newPage));
      return bot.answerCallbackQuery(query.id);
    }

    if (data === 'noop') {
      return bot.answerCallbackQuery(query.id);
    }

    // Выбор заявки
    if (data.startsWith('select:')) {
      const appId = data.split(':')[1];
      db.get('SELECT type, contact, phone, city, size, comment, status FROM applications WHERE id = ?', [appId], (err, row) => {
        if (err || !row) {
          return bot.answerCallbackQuery(query.id, { text: 'Заявка не найдена', show_alert: true });
        }

        let message = '';
        if (row.type === 'cups') {
          message = `🥤 Бесплатные стаканчики\n🆔 Заявка #${appId}\nКонтакт: ${row.contact}\nГород: ${row.city}\nТелефон: ${row.phone}`;
        } else {
          message = `🏢 Заявка для бренда\n🆔 Заявка #${appId}\nКонтакт: ${row.contact}\nТелефон: ${row.phone}\nРазмер: ${row.size || '—'}\nКомментарий: ${row.comment || '—'}`;
        }
        message += `\n\nТекущий статус: ${getEmoji(row.status)}`;

        const keyboard = {
          inline_keyboard: [
            [{ text: '✅ В работе', callback_data: `status:${appId}:в работе` }],
            [{ text: '❌ Отклонена', callback_data: `status:${appId}:отклонена` }],
            [{ text: '✔️ Завершена', callback_data: `status:${appId}:завершена` }],
            [{ text: '⬅️ Назад к списку', callback_data: 'back_to_list' }]
          ]
        };

        // Пытаемся отредактировать, но если не получится — отправим новое
        bot.editMessageText(message, {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: keyboard,
          parse_mode: 'Markdown'
        }).catch(() => {
          bot.sendMessage(chatId, message, { reply_markup: keyboard, parse_mode: 'Markdown' });
        });

        bot.answerCallbackQuery(query.id);
      });
      return;
    }

    // Смена статуса
    if (data.startsWith('status:')) {
      const [, appId, newStatus] = data.split(':');
      db.run('UPDATE applications SET status = ? WHERE id = ?', [newStatus, appId], () => {
        const statusMsg = `🆔 Заявка #${appId}\nСтатус: *${getEmoji(newStatus)}*`;
        bot.editMessageText(statusMsg, {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown'
        }).catch(() => {
          bot.sendMessage(chatId, statusMsg, { parse_mode: 'Markdown' });
        });
        bot.answerCallbackQuery(query.id, { text: `Статус изменён на: ${newStatus}` });
      });
      return;
    }

    // Назад к списку
    if (data === 'back_to_list') {
      bot.deleteMessage(chatId, messageId).catch(() => {});
      const fakeMsg = { from: { id: userId }, chat: { id: userId } };
      handleApplicationsCommand(fakeMsg, { 2: '' }, 1);
      bot.answerCallbackQuery(query.id);
    }
  });
}

// === 🌐 Express сервер ===
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(bodyParser.json());

app.get('/test', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/submit', (req, res) => {
  const { type } = req.body;

  if (!['cups', 'brand'].includes(type)) {
    return res.status(400).json({ error: 'Тип заявки: "cups" или "brand"' });
  }

  let fields;
  if (type === 'cups') {
    const { contact, city, phone } = req.body;
    if (!contact || !city || !phone) {
      return res.status(400).json({ error: 'Для стаканчиков нужны: контактное лицо, город и телефон' });
    }
    fields = { contact, phone, city, size: null, comment: null };
  } else {
    const { contact, phone, size, comment } = req.body;
    if (!contact || !phone || !size) {
      return res.status(400).json({ error: 'Для брендов нужны: контактное лицо, телефон и размер' });
    }
    fields = { contact, phone, city: null, size, comment };
  }

  const { contact, phone, city, size, comment } = fields;

  db.run(
    `INSERT INTO applications (type, contact, phone, city, size, comment)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [type, contact, phone, city, size, comment],
    function (err) {
      if (err) {
        console.error('❌ Ошибка БД:', err);
        return res.status(500).json({ error: 'Ошибка сохранения' });
      }

      db.get('SELECT * FROM applications WHERE id = ?', [this.lastID], (err, row) => {
        if (!err && bot) notifyAdmins(row);
        res.json({ ok: true });
      });
    }
  );
});

app.get('/api/applications', (req, res) => {
  db.all('SELECT * FROM applications ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'БД' });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`✅ HTTP сервер запущен на http://localhost:${PORT}`);
  if (bot) console.log('🤖 Telegram бот запущен');
});
