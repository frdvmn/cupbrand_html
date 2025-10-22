// src/js/app.js
import { validateForms } from "./validate-forms.js";
import GraphModal from "graph-modal";

const modal = new GraphModal();
// Подключаем валидацию к формам
validateForms("#brandform", modal);
validateForms("#cupsform", modal);
