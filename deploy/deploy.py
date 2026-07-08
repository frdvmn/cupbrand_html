import paramiko
import os
import time

HOST = '83.217.202.177'
USER = 'root'
PASS = 'o4nA#fQ#s5X-w*'
DOMAIN = 'cupbrand.ru'
REPO = 'https://github.com/frdvmn/cupbrand_html.git'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASS)

def run(cmd, sudo=False):
    if sudo:
        cmd = f'sudo {cmd}'
    stdin, stdout, stderr = client.exec_command(cmd)
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    return exit_code, out, err

def run_stdin(cmd, stdin_text, sudo=False):
    if sudo:
        cmd = f'sudo {cmd}'
    stdin, stdout, stderr = client.exec_command(cmd)
    stdin.write(stdin_text)
    stdin.flush()
    stdin.channel.shutdown_write()
    exit_code = stdout.channel.recv_exit_status()
    out = stdout.read().decode().strip()
    err = stderr.read().decode().strip()
    return exit_code, out, err

print("=== 1. Updating apt ===")
run("DEBIAN_FRONTEND=noninteractive apt update -y", sudo=True)

print("=== 2. Installing Apache2 ===")
run("DEBIAN_FRONTEND=noninteractive apt install -y apache2", sudo=True)

print("=== 3. Enabling modules ===")
run("a2enmod rewrite", sudo=True)

print("=== 4. Creating project directory ===")
run("mkdir -p /var/www/" + DOMAIN, sudo=True)

print("=== 5. Cloning project ===")
code, out, err = run(f"cd /var/www/{DOMAIN} && git clone {REPO} . 2>&1")
print(out[:500] if out else "ok")

print("=== 6. Uploading built app/ folder ===")
LOCAL_APP = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "app")
REMOTE_APP = f"/var/www/{DOMAIN}/app"

sftp = client.open_sftp()
try:
    sftp.stat(REMOTE_APP)
except FileNotFoundError:
    run(f"mkdir -p {REMOTE_APP}", sudo=True)

# Upload built files
for root, dirs, files in os.walk(LOCAL_APP):
    for d in dirs:
        local_dir = os.path.join(root, d)
        rel_path = os.path.relpath(local_dir, LOCAL_APP)
        remote_dir = os.path.join(REMOTE_APP, rel_path).replace("\\", "/")
        try:
            sftp.stat(remote_dir)
        except FileNotFoundError:
            sftp.mkdir(remote_dir)

    for f in files:
        local_file = os.path.join(root, f)
        rel_path = os.path.relpath(local_file, LOCAL_APP)
        remote_file = os.path.join(REMOTE_APP, rel_path).replace("\\", "/")
        sftp.put(local_file, remote_file)
        print(f"  uploaded: {rel_path}")

sftp.close()
print("  Upload complete!")

print("=== 7. Setting permissions ===")
run(f"chown -R www-data:www-data /var/www/{DOMAIN}", sudo=True)
run(f"chmod -R 755 /var/www/{DOMAIN}", sudo=True)

print("=== 8. Creating Apache vhost ===")
vhost = f"""<VirtualHost *:80>
    ServerName {DOMAIN}
    ServerAlias www.{DOMAIN}
    DocumentRoot /var/www/{DOMAIN}/app

    <Directory /var/www/{DOMAIN}/app>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${{APACHE_LOG_DIR}}/{DOMAIN}_error.log
    CustomLog ${{APACHE_LOG_DIR}}/{DOMAIN}_access.log combined
</VirtualHost>
"""

run_stdin(f"tee /etc/apache2/sites-available/{DOMAIN}.conf", vhost, sudo=True)

print("=== 9. Enabling site ===")
run("a2dissite 000-default", sudo=True)
run(f"a2ensite {DOMAIN}", sudo=True)

print("=== 10. Testing config ===")
code, out, err = run("apache2ctl configtest", sudo=True)
print(out[:500] if out else err[:500])

print("=== 11. Restarting Apache ===")
run("systemctl restart apache2", sudo=True)
run("systemctl enable apache2", sudo=True)

print("=== 12. Status ===")
code, out, err = run("systemctl status apache2 --no-pager | head -15", sudo=True)
print(out)

print("=== 13. Firewall ===")
run("ufw allow 80/tcp", sudo=True)
run("ufw allow 443/tcp", sudo=True)
run("ufw allow ssh", sudo=True)
run("ufw --force enable", sudo=True)

print("=== 14. Test ===")
code, out, err = run("curl -s -o /dev/null -w '%{http_code}' http://localhost")
print(f"HTTP status: {out}")

client.close()
print("\n=== DEPLOYMENT COMPLETE ===")
print(f"Site: http://{DOMAIN}")
