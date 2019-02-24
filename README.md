# Keyfolio
A searchable database of Keyforge cards. Still adding more cards / features.

Search keyforge cards via title, house, type, or rarity.

Features a basic API for the database:  
  **/API/cards:**  
    - Returns a list of all the cards stored in the database  
  **/API/decks:**
   - Returns a list of all the cards stored in the database
  **/API/glossary:**  
    -Returns a list of game terms based on a given category  
    *-Input:*
    
      - category: A string from ("houses","traits","types","rarities")  
  **/API/searchCards:**  
    - Returns a list of cards matching a set of given parameters  
    *- Input:*
    
      - Title: A string representing the title of the card (or a portion of it)  
      - Houses: A array of strings representing house names  
      - Rarities: A array of string representing card rarities  
      - Types: A array of strings representing card types
      
    -If any of the above inputs are not passed, the search assumes any of the possible values are valid  
  **/API/cardCount:**
   - Returns the number of cards in the database
  **/API/deckCount:**
   - Returns the number of decks in the database
   
     
