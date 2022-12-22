
class Api {
  /* Medlemsvariabel url, för att lagra en grund-url till servern. */
  url = '';

  /* När en instans av klassen skapas skickas url in som parametern */
  constructor(url) {
    /* Medlemsvariabeln url sätts till den sträng som man skickar in när man skapar en instans av klassen (det görs i script.js). Detta upplägg är för att göra denna klass generell. Tanken är att det ska gå att använda vår api-klass till olika HTTP-anrop, inte bara sådana för våran todo-applikation.   */
    this.url = url;
  }

  /* Metod för att hatera att skapa resurser (Create i CRUD). Motsvarar ett anrop med metoden POST.   
  
  Create = POST
  */
  create(data) {
    const JSONData = JSON.stringify(data);
    console.log(`Sending ${JSONData} to ${this.url}`);

    const request = new Request(this.url, {
      method: 'POST',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });

    /* JavaScripts inbyggda funktion fetch är det som används för att göra HTTP-anrop. Fetch tar ett requestobjekt som parameter. Här skickar vi in det requestobjekt som vi skapade direkt ovanför.  */

    /* Fetch är inbyggt i JavaScript och används för HTTP-kommunikation till andra servrar, för att t.ex. hämta data. Här använder vi */
    return (
      /* Fetch är asynkron och vi bearbetar förfrågan och svar i flera olika steg med hjälp av then. Slutligen, när hela "then"-kedjan är färdig, kommer resultatet av det hela att returneras ur denna create-metod. Det är därför hela fetch och alla dess then är omslutna av parenteser och står efter return. Man returnerar alltså hela det uttrycket ut ur metoden.  */
      fetch(request)
        /* När förfrågan skickats kommer först ett svar i ett oläsbart format. Det tas här emot i en parameter som kallas result, så det avkodas med hjälp av metoden json som finns på result-objektet. result.json() är också asynkrion */
        .then((result) => result.json())
        /* Output från result.json() bearbetas genom att det bara tas emot och skickas vidare (data) => data är en förkortning av function(data) {return data}, där data då alltså är resultatet av den asynkrona metoden result.json(). */
        .then((data) => data)
        /* Om något i förfrågan eller svaret går fel, fångas det upp här i catch, där information om felet skrivs ut till loggen.  */
        .catch((err) => console.log(err))
    );
  }

  /* Read - GET */
  getAll() {
    /* I detta fetch-anrop behövs inga särskilda inställningar. Fetch kan ta bara url:en som parameter också, istället för att man skapar ett helt request-objekt och skickar in det. */
    return fetch(this.url)
      .then((result) => result.json())
      .then((data) => data)
      .catch((err) => console.log(err));
  }

  remove(id) {

    console.log(`Removing task with id ${id}`);

    return fetch(`${this.url}/${id}`, {
      method: 'DELETE'
    })
      .then((result) => result)
      .catch((err) => console.log(err));

  }



  update(id, completed) {
    const data = {"id": id, "completed": completed}
    const JSONData = JSON.stringify(data);
    console.log(`Sending ${JSONData} to ${this.url}`);

    const request = new Request(`${this.url}/${id}`, {
      method: 'PATCH',
      body: JSONData,
      headers: {
        'content-type': 'application/json'
      }
    });

    return (
      fetch(request)
        .then((result) => result.json())
        .then((data) => data)
        .catch((err) => console.log(err))
    );
  }
    
    

 

  /* Precis som vid create behöver även här {options} innehålla egenskapen body - dvs. de data som ska skickas till server. */

  /* Det finns några sätt att utforma det som ska skickas i förfrågans body. Oavsett vad vi väljer ska det först översättas till JSON. 
  
  Alternativ 1: body består av ett helt task-objekt, som också inkluderar förändringen. Exempel: {id: 1,  title: "x", description: "x", dueDate: "x", completed: true/false}
  Alternativ 2: request-objektets body består bara av förändringarna och vilken uppgift som ska förändras. Exempel: {id: 1, completed: true/false }
  
  Om du hittar något annat sätt som funkar för dig, använd för all del det, så länge det uppnår samma sak. :)
  
  */

  /***********************Labb 2 ***********************/
}
