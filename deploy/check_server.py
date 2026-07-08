import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('83.217.202.177', username='root', password='o4nA#fQ#s5X-w*')

commands = [
    'which git 2>/dev/null && git --version || echo "no git"',
    'dpkg -l | grep -i apache || echo "no apache"',
    'which nginx 2>/dev/null && nginx -v || echo "no nginx"',
    'which node 2>/dev/null && node -v || echo "no node"',
    'ls /var/www/ 2>/dev/null || echo "no /var/www"',
    'ufw status 2>/dev/null || echo "no ufw"',
]

for cmd in commands:
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    print(f'=== {cmd} ===')
    if out: print(out)
    if err: print(err)
    print()

client.close()
