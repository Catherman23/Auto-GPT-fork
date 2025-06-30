import os
import subprocess
from datetime import datetime
import openai

# Load API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in environment")
openai.api_key = OPENAI_API_KEY

# Path to your repository
dir_path = os.path.expanduser("~/wms-agent")

# High-level goal for the WMS MVP
goal = (
    "Build a Warehouse Management System MVP with the following features:\n"
    "  1. A responsive owner dashboard (owner.html) that shows:\n"
    "     • Total products listed, grouped by category.\n"
    "     • Kitting project completion rate (percent complete vs. planned).\n"
    "     • Orders picked vs. packed vs. shipped counts.\n"
    "     • Income tracking alerts: revenue per box kitted each month.\n"
    "     • Replenishment alerts: flag SKUs below their reorder threshold.\n"
    "  2. A product details page (product.html) that displays:\n"
    "     • SKU, name, description.\n"
    "     • Product weight, dimensions (L×W×H), and fragile flag.\n"
    "     • Current on-hand quantity and reorder point.\n"
    "  3. An orders page (orders.html) listing recent orders with status (picked/packed/shipped).\n"
    "  4. A Data Insights Dashboard (insights.html) with interactive charts:\n"
    "     • A line chart of monthly revenue vs. boxes processed (use Recharts or Chart.js).\n"
    "     • A bar chart of top 10 SKUs by volume and low-stock alerts.\n"
    "     • A pie chart of order status distribution (picked/packed/shipped).\n"
    "     • KPI cards showing average processing time, average order value, and churn rate.\n"
    "  5. All pages styled with Tailwind CSS via CDN, a shared navbar, footer, and smooth animations.\n"
    "Generate scaffold files: owner.html, product.html, orders.html, insights.html, "
    "plus updates to home.html and main.js to wire up React routing and chart imports."
)

def ask_gpt(prompt: str) -> str:
    """Call ChatCompletion API and return the assistant response."""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful coder."},
                {"role": "user", "content": prompt},
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"/* Error: {e} */"

def write_and_commit(filename: str, content: str):
    """Write content to a file, commit, and push to GitHub."""
    path = os.path.join(dir_path, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    subprocess.run(["git", "add", filename], cwd=dir_path)
    subprocess.run([
        "git", "commit", "-m", f"auto: update {filename} @ {datetime.utcnow()}"
    ], cwd=dir_path)
    subprocess.run(["git", "push"], cwd=dir_path)

if __name__ == "__main__":
    # Generate owner.html
    prompt_owner = goal + "\n\nGenerate the full HTML for owner.html."
    owner_html = ask_gpt(prompt_owner)
    write_and_commit("owner.html", owner_html)

    # Generate product.html
    prompt_product = goal + "\n\nGenerate the full HTML for product.html."
    product_html = ask_gpt(prompt_product)
    write_and_commit("product.html", product_html)

    # Generate orders.html
    prompt_orders = goal + "\n\nGenerate the full HTML for orders.html."
    orders_html = ask_gpt(prompt_orders)
    write_and_commit("orders.html", orders_html)

    # Generate insights.html
    prompt_insights = goal + "\n\nGenerate the full HTML for insights.html."
    insights_html = ask_gpt(prompt_insights)
    write_and_commit("insights.html", insights_html)

    # Generate home.html
    prompt_home = goal + "\n\nGenerate the full HTML for home.html."
    home_html = ask_gpt(prompt_home)
    write_and_commit("home.html", home_html)

    # Generate main.js
    prompt_js = goal + "\n\nProvide a minimal React main.js that sets up routing to owner.html, product.html, orders.html, insights.html, and renders the home page initially."
    js = ask_gpt(prompt_js)
    write_and_commit("main.js", js)

