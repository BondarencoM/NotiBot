import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import request from 'request'
import dotenv from 'dotenv'
dotenv.config()

export async function update() {
    console.log("Using service agent with email: " + process.env.google_api_client_email)
    const jwt = new JWT({
        email: process.env.google_api_client_email,
        key: process.env.google_api_private_key.replaceAll('\\n', '\n',),
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
          ],
      });
    

    const doc = new GoogleSpreadsheet(process.env.google_sheet_id, jwt)
    await doc.loadInfo()

    const sheet = doc.sheetsByTitle['Trash']
    const schedule = await sheet.getRows()

    for (const week of schedule) {
        if (week.get('Is this week') === "yes") {
            console.log("It's " + week.get('Name'))

            const options = {
                method: 'POST',
                url: 'https://whin2.p.rapidapi.com/send2group',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': process.env.wa_bot_key,
                    'X-RapidAPI-Host': 'whin2.p.rapidapi.com'
                },
                body: {
                    text: week.get('Name') + ' is taking out the trash this week. Thanks ❤',
                },
                json: true,
            };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                console.log('WA bot responded with ' + response.statusCode);
                if (response.statusCode !== 200) {
                    throw response, body
                }
            });
            break;
        }
    }
}