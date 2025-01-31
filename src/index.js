// index.js
let ramens = []

let inEditMode = false

let formData = {
  name: '',
  restaurant: '',
  image: '',
  rating: 0,
  comment: ''
}

const ramenDetail = document.getElementById('ramen-detail');
const ramenImage = ramenDetail.querySelector('.detail-image');
const ramenName = ramenDetail.querySelector('.name');
const ramenRestaurant = ramenDetail.querySelector('.restaurant');
const ramenRating = document.getElementById('rating-display');
const ramenComment = document.getElementById('comment-display');

const cleanUp = () => {
  ramenName.textContent = ""
  ramenRestaurant.textContent = ""
  ramenImage.src = ""
  ramenRating.textContent = ""
  ramenComment.textContent = ""
}

const ramenFinder = (id) => {
  const foundRamen = ramens.find(ramen => String(ramen.id) === id)
  const ramenObj = {
    id: String(id),
    name: foundRamen.name,
    restaurant: foundRamen.restaurant,
    image: foundRamen.image,
    rating: foundRamen.rating,
    comment: foundRamen.comment
  }
  handleClick(ramenObj)

}

// Callbacks
const handleClick = (ramen) => {

  ramenName.textContent = ramen.name
  ramenRestaurant.textContent = ramen.restaurant
  ramenImage.src = ramen.image
  ramenRating.textContent = ramen.rating
  ramenComment.textContent = ramen.comment

};






const form = document.getElementById('new-ramen');
form.addEventListener('input', function (e) {
  const { name, value } = e.target
  formData = {
    ...formData,
    [name]: value
  }
});

const addSubmitListener = () => {
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    const newRamen = formData
    createRamen(newRamen)
  });
};
addSubmitListener()

async function createRamen(newRamen) {
  try {
    const r = await fetch(`http://localhost:3000/ramens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRamen)
    })
    if (!r.ok) {
      throw new Error('error')
    }
    const data = await r.json()
    const updatedList = [...ramens, data]
    displayRamens(updatedList)
    ramens = updatedList
    cleanUp()
  } catch (error) { console.log(error) }
}









const displayRamens = async () => {
  try {
    const r = await fetch(`http://localhost:3000/ramens`)
    if (!r.ok) {
      throw new Error('thrown')
    }
    const data = await r.json()
    ramens = data
    const ramenMenu = document.getElementById('ramen-menu')

    const ramenMenuHtml = data.map(ramen => (
      `<img src=${ramen.image} id=${String(ramen.id)} alt='img' type='button'/>`
    ))
    ramenMenu.innerHTML = ramenMenuHtml.join('')
    handleClick(ramens[0])
    ramenMenu.addEventListener('click', function (e) {
      const { id } = e.target
      ramenFinder(id)
    })
  } catch (error) { console.error(error) }
};




const main = async () => {
  displayRamens()
  // Invoke addSubmitListener here
}
window.addEventListener("DOMContentLoaded", main)

main()

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};