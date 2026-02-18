document.addEventListener('DOMContentLoaded', ()=>{
  const list = document.getElementById('eventsList');
  const addBtn = document.getElementById('addEvent');

  function addEventRow(title='',date='',time='',detail=''){
    const row = document.createElement('div');
    row.className = 'event-row';
    row.innerHTML = `
      <input name="event_title" placeholder="Event name" value="${title}" required>
      <input name="event_date" placeholder="Date (e.g. 20 Feb 2026)" value="${date}">
      <input name="event_time" placeholder="Time (optional)" value="${time}">
      <input name="event_details" placeholder="Short details / venue" value="${detail}">
      <button type="button" class="remove">Remove</button>
    `;
    row.querySelector('.remove').addEventListener('click', ()=>row.remove());
    list.appendChild(row);
  }

  addBtn.addEventListener('click', ()=> addEventRow());
  // add one default row
  addEventRow('Wedding','', '', '');
});
