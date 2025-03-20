document.addEventListener('DOMContentLoaded', main);

function main() {
  displayRamens();
  addSubmitListener();
}

let ramens = []; // Global ramen list

// Fetch & Display Ramens 
function displayRamens() {
  fetch('http://localhost:3000/ramens')
    .then(res => res.json())
    .then(data => {
      ramens = data;
      const menu = document.querySelector('#ramen-menu');
      menu.innerHTML = ''; // Clear menu
      ramens.forEach(renderRamenMenu);
      if (ramens.length > 0) {
        handleClick(ramens[0]); // Load first ramen on page load
      }
    })
    .catch(error => console.error('Error fetching ramens:', error));
}

//Render Ramen Menu 
function renderRamenMenu(ramen) {
  const imgCard = document.createElement('img');
  imgCard.src = ramen.image;
  imgCard.addEventListener('click', () => handleClick(ramen));
  document.querySelector('#ramen-menu').appendChild(imgCard);
}

// Display Selected Ramen Details 
function handleClick(ramen) {
  document.querySelector('.detail-image').src = ramen.image;
  document.querySelector('.name').textContent = ramen.name;
  document.querySelector('.restaurant').textContent = ramen.restaurant;
  document.querySelector('#rating-display').textContent = ramen.rating;
  document.querySelector('#comment-display').textContent = ramen.comment;

  // Set up edit form
  document.getElementById('edit-rating').value = ramen.rating;
  document.getElementById('edit-comment').value = ramen.comment;

  const editForm = document.getElementById('edit-ramen');
  const editBtn = editForm.querySelector('input[type="submit"]');



  // Set up delete button
  let deleteBtn = document.getElementById('delete-btn');
  if (!deleteBtn) {
    deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.id = 'delete-btn';
    editForm.appendChild(deleteBtn);
  }
  deleteBtn.replaceWith(deleteBtn.cloneNode(true));
  document.getElementById('delete-btn').addEventListener('click', () => handleDeleteRamen(ramen));
}

//Handle Edit Form Submission (PATCH) 
function handleEditSubmit(e, ramen) {
  e.preventDefault();
  const newRating = document.getElementById('edit-rating').value;
  const newComment = document.getElementById('edit-comment').value;

  fetch(`http://localhost:3000/ramens/${ramen.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating: newRating, comment: newComment })
  })
    .then(res => res.json())
    .then(updatedRamen => {
      document.querySelector('#rating-display').textContent = updatedRamen.rating;
      document.querySelector('#comment-display').textContent = updatedRamen.comment;

      // Update local state
      ramens = ramens.map(r => r.id === updatedRamen.id ? updatedRamen : r);
    })
    .catch(error => console.error("Error updating ramen:", error));
}

// Handle New Ramen Submission (POST) */
function addSubmitListener() {
  document.getElementById('new-ramen').addEventListener('submit', function (e) {
    e.preventDefault();

    let newRamen = {
      name: document.querySelector('#new-name').value,
      restaurant: document.querySelector('#new-restaurant').value,
      image: document.querySelector('#new-image').value,
      rating: document.querySelector('#new-rating').value,
      comment: document.querySelector('#new-comment').value
    };

    fetch('http://localhost:3000/ramens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRamen)
    })
      .then(res => res.json())
      .then(ramen => {
        renderRamenMenu(ramen); // Add ramen to menu
        document.getElementById('new-ramen').reset(); // Clear form
      })
      .catch(error => console.error('Error adding ramen:', error));
  });
}

// Handle Ramen Deletion (DELETE)
function handleDeleteRamen(ramen) {
  fetch(`http://localhost:3000/ramens/${ramen.id}`, {
    method: "DELETE"
  })
    .then(() => {
      ramens = ramens.filter(r => r.id !== ramen.id);
      displayRamens();
    })
    .catch(error => console.error("Error deleting ramen:", error));
}

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
