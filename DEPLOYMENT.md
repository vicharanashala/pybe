\# Deploying PyBe to Render



This guide documents the steps to deploy the PyBe app (server + client) to Render.com for free, based on hands-on testing.



\## Backend (Server) Deployment



1\. On Render, create a \*\*New Web Service\*\* and connect your GitHub repository.

2\. Set the following:

&#x20;  - \*\*Root Directory:\*\* `server`

&#x20;  - \*\*Build Command:\*\* `npm install`

&#x20;  - \*\*Start Command:\*\* `node src/index.js`

&#x20;  - \*\*Instance Type:\*\* Free

3\. Deploy. Note the live URL Render gives you (e.g. `https://your-app.onrender.com`).



\## Frontend (Client) Deployment



1\. On Render, create a \*\*New Static Site\*\* and connect the same repository.

2\. Set the following:

&#x20;  - \*\*Root Directory:\*\* `client`

&#x20;  - \*\*Build Command:\*\* `npm install; npm run build`

&#x20;  - \*\*Publish Directory:\*\* `dist`

3\. Add an environment variable so the client knows where the backend lives:

&#x20;  - \*\*Key:\*\* `VITE\_API\_URL`

&#x20;  - \*\*Value:\*\* `https://your-backend-url.onrender.com/api`

4\. Deploy.



\## Fixing CORS Issues



If the deployed client shows `Failed to fetch` or CORS errors in the browser console, it usually means the backend's allowed origin doesn't match the deployed frontend URL.



Fix: On the backend service in Render, go to \*\*Environment\*\* and add:

&#x20;  - \*\*Key:\*\* `CLIENT\_ORIGIN`

&#x20;  - \*\*Value:\*\* your deployed frontend URL (e.g. `https://your-frontend.onrender.com`)



Save changes — Render will automatically redeploy the backend with the new setting.



\## Notes



\- Render's free tier spins down services after inactivity, so the first request after idling can take 30-50 seconds to respond.

\- Always redeploy the backend after changing environment variables for the change to take effect.

