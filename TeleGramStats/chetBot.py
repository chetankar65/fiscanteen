# - *- coding: utf- 8 - *-
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
from telegram.error import (TelegramError, Unauthorized, BadRequest, 
                            TimedOut, ChatMigrated, NetworkError)

import sqlite3

dbpath =r'C:\Users\chetan kar\sqlite-tools-win32-x86-3230100\responsesDB'

def response(bot, update):
    res = update.message.text.upper()
    if (res == "Y" or res == "YES"):
        #connect to poll.db here. CHECK FOR EXISTENCE PENDING 
        conn = sqlite3.connect(dbpath)
        update.message.reply_text("Recorded your vote. thank you !")
        #write in tyou your sqlite table here
        conn.execute("INSERT INTO Responses (Response) VALUES ('Yes')")
        conn.commit()
        conn.close()
    elif (res == "N" or res == "NO"):
        #connect to poll.db here. CHECK FOR EXISTENCE PENDING 
        conn = sqlite3.connect(dbpath)
        update.message.reply_text("Recorded your vote. thank you !")
        #write in tyou your sqlite table here
        conn.execute("INSERT INTO Responses (Response) VALUES ('No')")
        conn.commit()
        conn.close()
    else: 
        update.message.reply_text("Bad Response. Please respond in Y/N")

def main():
  TOKEN = '489144976:AAEQN6pKwyFm9kAnzW1Fno9cW0cdnB8w6iI'
  # Create Updater object and attach dispatcher to it
  updater = Updater(TOKEN)
  dispatcher = updater.dispatcher
  print("Bot started")

  # Add command handler to dispatcher
  resp = MessageHandler(Filters.text, response)
  dispatcher.add_handler(resp)

  # Start the bot
  updater.start_polling()

  # Run the bot until you press Ctrl-C
  updater.idle()



if __name__ == '__main__':
  main()
