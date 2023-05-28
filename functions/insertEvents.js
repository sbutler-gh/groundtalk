require('dotenv').config();

exports.handler = async (event) => {

    return {
        statusCode: 200,
        body: JSON.stringify(process.env.GOOGLE_CALENDAR_API_KEY)
      };

}