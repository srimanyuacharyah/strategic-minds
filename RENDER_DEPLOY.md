# Deploying CivicAI to Render (Manual Guide)

Follow these steps to host your application on Render as a Static Site.

## 1. Prepare Your Repository
- Ensure all your changes are committed and pushed to your GitHub repository.
- The project is already configured to build into the `dist/` folder.

## 2. Create a New Static Site on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New** > **Static Site**.
3. Connect your GitHub repository and select the `techfusion` project.

## 3. Deployment Settings
| Setting | Value |
|---------|-------|
| **Name** | `civic-ai` (or your preferred name) |
| **Build Command** | `npm run build` |
| **Publish Directory** | `dist` |

## 4. Environment Variables
In the Render dashboard, go to the **Environment** tab and add the following variables from your `.env` file:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (Ensure this is the full key)
- `VITE_GEMINI_API_KEY`
- `VITE_EMAILJS_SERVICE_ID` (Optional)
- `VITE_EMAILJS_TEMPLATE_ID` (Optional)
- `VITE_EMAILJS_PUBLIC_KEY` (Optional)

## 5. Handling Routes (Important!)
Since this is a Single Page Application (SPA), you must configure Render to redirect all traffic to `index.html`:
1. In your Render Static Site settings, go to the **Redirects/Rewrites** tab.
2. Click **Add Rule**.
3. Set **Source** to `/*`.
4. Set **Destination** to `/index.html`.
5. Set **Action** to `Rewrite`.

## 6. Finish
Click **Save Changes** and wait for the deployment to finish. Your app will be live on a `.onrender.com` URL!
