function HomePage() {

    const gender = 'F';

    const books = [
        {   
            code:"Web001",
            name:"Full stack web technology",
            author:"Shema",
            price: 100
        },
        {
            code: "SOD001",
            name: "Mastering Software engineering",
            author:'Ines',
            price: 80
        }
    ]
    const totalPrice = books.reduce((total, book) => total + book.price, 0)
    
  return (
    <div>
        <div><h2>This is the home page</h2></div>
        <div><p>These are the available books :<br/></p></div>
          <div>{
          gender === 'F' ? <div>hello Girl</div> :<div>hello Boy</div> 
        }</div>
        <div>
            <ol>
            {
                books.map(book => (
                    <li key={book.code}>
                        {book.name} — Price: {book.price}
                    </li>
                ))
            } 
            </ol>
        </div>
        <p>Total price for {books.length} books: {totalPrice}</p>
    </div>
  )
}

export default HomePage