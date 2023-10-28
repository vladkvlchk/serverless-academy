const express = require("express");
const fs = require("fs");

const PORT = 5000;
const HOST = process.env.HOST || 'http://localhost:' + PORT;

const app = express();
app.use(express.json());

const addLink = (long_link) => {
  const chars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM"; //length - 62
  const { links } = require("./db.json");
  const last_link = Object.keys(links[links.length - 1])[0]; // looking for last link in database

  let flag = false; // this flag we use to know if we need to keep changing next chars (false - we need | true - we don't need)
  let short_path = last_link
    .split("")
    .reverse()
    .map((char) => {
      if(flag) return char
      
      const n_i = chars.indexOf(char); //0-61
      if (n_i !== (chars.length - 1)) flag = true; // if index is not 61(max value)

      return chars[(n_i + 1) % 62];
    })
    .reverse()
    .join('');
  
  if (!flag){ // adding one char like we add figure when we get 10(2 figures) after 9(1 figure), or 100(3 figures) after 99(2 figures)
    short_path += chars[0]
  }

  links.push({[`${short_path}`]: long_link})
  fs.writeFileSync('./db.json', JSON.stringify({links}), 'utf-8');

  return short_path;
};

app.post("/", (req, res) => {
  try{
    const { link } = req.body;
    if (link.slice(0,7) !== 'http://' && link.slice(0,8) !== 'https://') { // link format validation
        throw new Error('Invalid format. Link must include \'http://\' or \'https://\'')
    }

    const short_path = addLink(link);
    res.json({short_link: `${HOST}/${short_path}`})
  } catch (e){
    res.status(500).send(e.message);
    console.error(e.message);
  }
});

app.get("/:path", async (req, res) => {
  try{
    const short_path = req.params.path;

    const data = await fs.readFileSync('./db.json', 'utf-8'); //getting database
    const { links } = JSON.parse(data);

    const link_obj = links.find(obj => Object.keys(obj)[0] === short_path); // looking for requested value
    if (!link_obj) throw new Error('Link is not found');

    res.redirect(link_obj[short_path]);
  } catch (e){
    res.status(500).send(e.message);
    console.error(e.message)
  }
});

app.listen(PORT, () => console.log("Server started on port ", PORT));