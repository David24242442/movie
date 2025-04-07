import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from scrape_silverbird_final import get_latest_movies  # import your function here
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()
BOT_TOKEN = os.getenv('BOT_TOKEN')

# Enable logging for debugging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# Command handler for /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🎬 Welcome! Send /movies to get the latest movies at Silverbird Cinemas Accra.")

# Command handler for /movies
async def movies(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Fetching movie listings... 🍿 Please wait a moment.")
    result = get_latest_movies()

    # Break long messages into chunks under 4096 characters (Telegram's max per message)
    for i in range(0, len(result), 4000):
        await update.message.reply_text(result[i:i + 4000])

# Main function (not async!)
def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("movies", movies))

    print("✅ Bot is running. Press Ctrl+C to stop.")
    app.run_polling()

if __name__ == "__main__":
    main()
