<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# how to deploy a backend running at port 3001 and frontend at 3000 and nginx at 443 on a VPS without using docker, can i run multiple terminals on a VPS

To deploy a backend on port 3001, frontend on port 3000, and Nginx on port 443 on a VPS without Docker, follow these steps:

### 1. **Deployment Architecture**

- **Frontend**: Serve static files via Nginx (no need for Node.js process on port 3000 in production).
- **Backend**: Run Node.js on port 3001.
- **Nginx**: Handle HTTPS (port 443), serve frontend files, and reverse-proxy API requests to backend.

---

### 2. **Step-by-Step Deployment**

#### **A. Configure Frontend for Production**

1. Build your frontend (e.g., React/Vue):

```bash
npm run build
```

2. Copy the build output to a directory served by Nginx:

```bash
sudo mkdir -p /var/www/frontend
sudo cp -r /path/to/frontend/build/* /var/www/frontend
```


#### **B. Configure Backend**

1. Run the backend on port 3001 (use `pm2` for process management):

```bash
cd /path/to/backend
npm install
pm2 start server.js --name "backend"  # Keeps it running after SSH exit
```


#### **C. Configure Nginx**

1. Install Nginx:

```bash
sudo apt update && sudo apt install nginx
```

2. Create a config file (e.g., `/etc/nginx/sites-available/your_domain`):

```nginx
server {
    listen 443 ssl;
    server_name your_domain.com;

    # SSL Configuration (use Let's Encrypt or self-signed)
    ssl_certificate /etc/ssl/certs/your_domain.crt;
    ssl_certificate_key /etc/ssl/private/your_domain.key;

    # Serve frontend static files
    root /var/www/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy for backend API
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your_domain.com;
    return 301 https://$host$request_uri;
}
```

3. Enable the config and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```


---

### 3. **Running Multiple Terminals on VPS**

Use terminal multiplexers to manage multiple processes in one SSH session:

#### **Option 1: `tmux`**

1. Start a session:

```bash
tmux new -s backend_session
```

2. Run the backend:

```bash
cd /path/to/backend && npm start
```

3. Detach with `Ctrl+B` → `D`.
4. Reattach later:

```bash
tmux attach -t backend_session
```


#### **Option 2: `screen`**

1. Create a session:

```bash
screen -S frontend_session
```

2. Run the frontend dev server (if needed):

```bash
cd /path/to/frontend && npm start
```

3. Detach with `Ctrl+A` → `D`.
4. Reattach:

```bash
screen -r frontend_session
```


---

### 4. **Firewall Configuration**

Allow ports 443 (HTTPS) and 22 (SSH):

```bash
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```


---

### 5. **Summary**

| **Component** | **Port** | **Access Method** |
| :-- | :-- | :-- |
| Nginx | 443 | `https://your_domain.com` |
| Backend | 3001 | Via Nginx `/api/` route |
| Frontend | - | Served statically by Nginx |

**Notes**:

- Frontend runs via Nginx (no port 3000 in production).
- Backend runs on port 3001 (managed by `pm2` or `tmux`).
- Use `tmux`/`screen` to run multiple services in the background.

For long-term reliability, use `pm2` for Node.js processes:

```bash
pm2 startup  # Auto-start on reboot
```

<div style="text-align: center">⁂</div>

[^1]: https://askubuntu.com/questions/1133284/how-do-i-run-multiple-terminals-in-vps

[^2]: https://www.linkedin.com/posts/masaudsec_hacking-cybersec-cybersecurity-activity-7059820238296522752-1d9u

[^3]: https://www.baeldung.com/linux/multiple-terminals-same-window

[^4]: https://www.reddit.com/r/node/comments/1bkez8s/how_to_deploy_when_frontend_and_api_is_running_on/

[^5]: https://medium.com/@vipiny35/deploy-frontend-and-backend-api-server-using-nginx-and-pm2-d60671a59b48

[^6]: https://stackoverflow.com/questions/61081446/for-nginx-am-i-listening-to-port-443-or-port-3000-for-this-url-https-localhos

[^7]: https://redthunder.blog/2017/06/14/teaching-how-to-use-nginx-to-frontend-your-backend-services-with-trusted-ca-certificates-on-https/

[^8]: https://www.jimlynchcodes.com/blog/setting-up-nginx-as-a-reverse-proxy-for-nodejs-forwarding-to-ssl-port-443

[^9]: https://fxvm.net/knowledge-base/how-many-mt4-mt5-terminals-can-i-run-on-vps/

[^10]: https://unix.stackexchange.com/questions/767405/start-multiple-terminal-windows-in-a-process-group-so-that-remaining-processes

[^11]: https://stackoverflow.com/questions/49022731/keep-getting-something-is-already-running-on-port-3000-when-i-do-npm-start-o

[^12]: https://dev.to/justincy/blue-green-node-js-deploys-with-nginx-bkc

[^13]: https://gist.github.com/soheilhy/8b94347ff8336d971ad0

[^14]: https://6.docs.plone.org/install/containers/examples/nginx-volto-plone.html

[^15]: https://simplifyscript.com/blogs/how-to-set-up-nginx-server-map-with-ports/

[^16]: https://www.forexvps.net/knowledge-base/how-many-mt4-or-trading-terminals-can-i-run-on-my-vps/

[^17]: https://www.mql5.com/en/forum/444966

[^18]: https://www.reddit.com/r/cpp_questions/comments/1b0q8zr/multiple_terminals/

[^19]: https://www.linux.com/news/execute-commands-simultaneously-multiple-servers/

[^20]: https://superuser.com/questions/1480493/how-to-launch-multiple-terminal-sessions-and-ssh-to-machines-based-on-profiles-s

