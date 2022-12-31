import { githubUser } from "./githubUser.js"

export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    
    this.onAdd()
     this.load()
  
  }
  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }
  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
  
  
  async add(username){
    try{
      const userExists = this.entries.find(entry => entry.login === username)
      
      if(userExists){
        throw new Error('Usuário já cadastrado')
      }
      const user = await githubUser.search(username)
      if(user.login === undefined){
        
        throw new Error('Usuario não encontrado!')
      }
      
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch(error){
      alert(error.message)
    }
  }
  
  
  delete(user){
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)
    this.entries = filteredEntries
    this.update()
    this.save()
  }
  
  
  
}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)
    
    this.tbody = this.root.querySelector('table tbody')
    
    this.update()
    
  }
  
  onAdd(){
    const addButton = this.root.querySelector('.favorite')
    addButton.onclick = () => {
      const { value } = this.root.querySelector("#input-search")
      
      this.add(value)
    }
  }
  
  
  update(){
    this.removeAllTr()
    this.entries.forEach( user => {
      
      const row = this.createRow()
      
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm('tem certeza que deseja deletar essa linha ?')
        if(isOk){
          this.delete(user)
        }
      }
      
      this.tbody.append(row)
    })
    
  }
    
  
  createRow(){
    const tr = document.createElement('tr')
    
    tr.innerHTML = `
    <td class="user">
    <img class="user-image" src="https://github.com/felipesoares.png" alt="imagem do felipe">
    <a href="https://github.com/felipesoares" target="_blank">
    <p>Felipe Soares</p>
    <span>felipesoares</span>
    </a>
    </td>
    <td class="repositories">76</td>
    <td class="followers">9589</td>
    <td class="remove">Remove</td>
    `
    return tr
  }
  
  removeAllTr(){
    
    this.tbody.querySelectorAll('tr').forEach((tr)=>{
      tr.remove()
    })
  }
  
  
  
}
