/* Importrerar nodemodulen express (installerad med npm), som är ett utbrett verktyg för att skapa och arbeta med webbservrar och hantera HTTP-förfrågningar i ett nodejs-backend. */
const express = require('express');
/* Skapar upp ett express-objekt, som i stort representerar en webbserver */
const app = express();

/* Importerar den inbyggda modulen fs */
const fs = require('fs/promises');

const PORT = 5000;
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await fs.readFile('./tasks.json');
    res.send(JSON.parse(tasks));
  } catch (error) {
    res.status(500).send({ error });
  }
});
/* Express metod för att lyssna efter POST-anrop heter naturligt post(). I övrigt fungerar den likadant som  get */
app.post('/tasks', async (req, res) => {
  try {
    const task = req.body;
    const listBuffer = await fs.readFile('./tasks.json');
    const currentTasks = JSON.parse(listBuffer);
    let maxTaskId = 1;
    if (currentTasks && currentTasks.length > 0) {
      maxTaskId = currentTasks.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId
      );
    }

    const newTask = { id: maxTaskId + 1, ...task };
    const newList = currentTasks ? [...currentTasks, newTask] : [newTask];

    await fs.writeFile('./tasks.json', JSON.stringify(newList));
    res.send(newTask);
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const listBuffer = await fs.readFile('./tasks.json');
    const currentTasks = JSON.parse(listBuffer);
    if (currentTasks.length > 0) {
      await fs.writeFile(
        './tasks.json',
        JSON.stringify(currentTasks.filter((task) => task.id != id))
      );
      /* När den nya listan har skrivits till fil skickas ett success-response  */
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
      /* Om det inte fanns något i filen sedan tidigare skickas statuskod 404. 404 används här för att det betyder "Not found", och det stämmer att den uppgift som man ville ta bort inte kunde hittas om listan är tom. Vi har dock inte kontrollerat inuti en befintlig lista om det en uppgift med det id som man önskar ta bort faktiskt finns. Det hade man också kunnat göra. */
      res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
    /* Om något annat fel uppstår, skickas statuskod 500, dvs. ett generellt serverfel, tillsammans med information om felet.  */
    res.status(500).send({ error: error.stack });
  }
});

/***********************Labb 2 ***********************/
/* Här skulle det vara lämpligt att skriva en funktion som likt post eller delete tar kan hantera
 PUT- eller PATCH-anrop (du får välja vilket, läs på om vad som verkar mest vettigt för det du ska göra) 
 för att kunna markera uppgifter som färdiga. Den nya statusen - completed true eller falase -
  kan skickas i förfrågans body (req.body) tillsammans med exempelvis id så att man kan söka fram en given 
  uppgift ur listan, uppdatera uppgiftens status och till sist spara ner listan med den uppdaterade uppgiften */

/* Observera att all kod rörande backend för labb 2 ska skrivas i denna fil och inte i app.node.js. App.node.js är bara till för exempel från lektion 5 och innehåller inte någon kod som används vidare under lektionerna. */
/***********************Labb 2 ***********************/

/* psuedo
app.patch/put(tasks, async (req, res) => {
  try
    kontrollera parameter id
    kontrollera parameter completed
    listbuffer vänta svar json
    finns uppgiften?
    är completed true eller false?
    patch/put så att den blir true/false
      res(den är ändrad)
  else
    finns inte uppgiften
    error uppgiften finns inte
  else
    annat problem
})

/* Med app.listen säger man åte servern att starta. Första argumentet är port - dvs. det portnummer man vill att servern ska köra på. Det sattes till 5000 på rad 9. Det andra argumentet är en anonym arrow-funktion som körs när servern har lyckats starta. Här skrivs bara ett meddelande ut som berättar att servern kör, så att man får feedback på att allt körts igång som det skulle. */
app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
