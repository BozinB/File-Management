const modal_2 = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const crveno_1 = document.querySelector('[name=crveno_1]')
const imeKirilica = document.querySelector('[name=imeKirilica]')
const imeLatinica = document.querySelector('[name=imeLatinica]')
const crveno_2 = document.querySelector('[name=crveno_2]')
const dugme_isprati = document.querySelector('[name=dugme_isprati]')
const postoi = document.querySelector('[name=postoi]')
const oddell = document.querySelector('[name=oddel]')
let append
let edit

const openModal = function (btn, oddel='null', imeK='', imeL='') {
  edit = (imeK==='') ? false : true
  console.log(edit)
  append = btn.parentNode
  modal_2.classList.remove('hidden');
  overlay.classList.remove('hidden');
  imeKirilica.value = imeK
  imeLatinica.value = imeL
  oddell.value = oddel
};

const closeModal = function () {
  imeKirilica.value = ''
  imeLatinica.value = ''
  modal_2.classList.add('hidden');
  overlay.classList.add('hidden');
  if (!crveno_1.classList.contains('hidden')) crveno_1.classList.add('hidden')
  if (!crveno_2.classList.contains('hidden')) crveno_2.classList.add('hidden')
  if (!postoi.classList.contains('hidden')) postoi.classList.add('hidden')
};

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal_2.classList.contains('hidden')) {
    closeModal();
  }
});

const newFile = (btn, id) => {
  return location.href = (`/new_file/${id}`)
}
const editFile = (btn, id) => {
  return location.href = (`/edit_file/${id}`)
}


let brisiDokument = async (btn, id) => {
  let i = confirm(`Ве молам потврдете го бришењето на документот.
Оваа операција не може да се врати!`)
const csrf = btn.closest('article').parentNode.querySelector('[name=_csrf]').value
  if (i) {
    let izbrisi = btn.parentNode
    let odgovor = await fetch('/brisi_file', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrf
      },
      body: JSON.stringify({tip: id}) 
    
    })
    let k = await odgovor.json()
    console.log(k)
    if (odgovor.status === 202) {
      izbrisi.remove()
    }

  }
  }
let brisiDepartment = async (btn, id) => {
  let i = confirm(`Ве молам потврдете го бришењето на категоријата.
Доколку продолжите ќе се избришат сите подкатегории со сите документи во нив!
Оваа операција не може да се врати!`)
const csrf = btn.closest('article').parentNode.querySelector('[name=_csrf]').value
  if (i) {
    let izbrisi = btn.parentNode
    let odgovor = await fetch('/department', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrf
      },
      body: JSON.stringify({tip: id}) 
    
    })
    let k = await odgovor.json()
    console.log(k)
    if (odgovor.status === 202) {
      izbrisi.remove()
    }

  }
  }

  let addMainCategory = async (btn) => {
    try {
      const csrf = btn.parentNode.querySelector('[name=_csrf]').value
      const oddel = btn.parentNode.querySelector('[name=oddel]').value
      const imeKirilica = btn.parentNode.querySelector('[name=imeKirilica]').value.trim()
      const imeLatinica = btn.parentNode.querySelector('[name=imeLatinica]').value.trim()
      let isprati = {
        oddel: oddel,
        imeKirilica: imeKirilica,
        imeLatinica: imeLatinica,
        edit: edit
      }
      let odgovor = await fetch('/department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrf
        },
        body: JSON.stringify(isprati) 
      
      })
      console.log(odgovor.status)
      if (odgovor.status === 400) {
        let kk = await odgovor.json()
        console.log(kk)
        edit = kk.edit
        if (kk.imeKirilica === '') {
          crveno_1.classList.remove('hidden')
         } else { 
          if (!crveno_1.classList.contains('hidden')) crveno_1.classList.add('hidden')
          if (!postoi.classList.contains('hidden')) postoi.classList.add('hidden')
          imeKirilica.value = kk.imeKirilica
        }
        if (kk.imeLatinica === '') {
          crveno_2.classList.remove('hidden')
        } else { 
          if (!crveno_2.classList.contains('hidden')) crveno_2.classList.add('hidden')
          if (!postoi.classList.contains('hidden')) postoi.classList.add('hidden')
          imeLatinica.value = kk.imeLatinica
         }
      }
      if (odgovor.status === 410) {
        location.reload()
         
      }
      if (odgovor.status === 409) {
        if (!crveno_1.classList.contains('hidden')) crveno_1.classList.add('hidden')
        if (!crveno_2.classList.contains('hidden')) crveno_2.classList.add('hidden')
        let kk = await odgovor.json()
        edit = kk.edit
        imeKirilica.value = kk.imeKirilica
        postoi.classList.remove('hidden')
        imeLatinica.value = ''
        
      }
      if (odgovor.status === 200) {
        let k = await odgovor.json()
        edit = k.edit
        console.log('-----------------------', k)
        if (k.oddel === 'null') {

          let article = document.createElement('article');
          article.className = 'glaven'
          let div = document.createElement('div');
          div.className = 'glaven-kontejner-prvo' 
          let span = document.createElement('span')
          span.className = 'hH3'
          span.setAttribute('name', 'naslov')
          span.innerHTML = `${k.imeKirilica}`
          let input_3 = document.createElement('input')
          input_3.type = 'hidden'
          input_3.name = 'imeKirilica'
          input_3.value = `${k.imeKirilica}`
          let input_1 = document.createElement('input')
          input_1.type = 'hidden'
          input_1.name = 'imeLatinica'
          input_1.value = `${k.imeLatinica}`
          let input_2 = document.createElement('input')
          input_2.type = 'hidden'
          input_2.name = 'oddel'
          input_2.value = `${k._id}`
          let button_1 = document.createElement('button')
          button_1.type = 'button'
          button_1.setAttribute('onclick', 'openModal(this, this.parentNode.querySelector(\'[name=oddel]\').value)')
          button_1.className= 'dDugme newFolder'
          button_1.setAttribute('title', 'Креирајте нова подкатегорија')
          let button_2 = document.createElement('button')
          button_2.type = 'button'
          button_2.setAttribute('title', 'Избриши ја категоријата')
          button_2.setAttribute('onclick', 'brisiDepartment(this, this.parentNode.querySelector(\'[name=oddel]\').value)')
          button_2.className= 'dDugme brisi'
          let button_3 = document.createElement('button')
          button_3.type = 'button'
          button_3.setAttribute('title', 'Изменете ја категоријата')
          button_3.setAttribute('onclick', 'openModal(this, this.parentNode.querySelector(\'[name=oddel]\').value, this.parentNode.querySelector(\'[name=imeKirilica]\').value, this.parentNode.querySelector(\'[name=imeLatinica]\').value)')
          button_3.className= 'dDugme edit'
          
          
          div.appendChild(span)
          div.appendChild(input_3)
          div.appendChild(input_1)
          div.appendChild(input_2)
          div.appendChild(button_1)
          div.appendChild(button_2)
          div.appendChild(button_3)
          
          article.appendChild(div)
          append.appendChild(article)
        } else {
          let div = document.createElement('div');
          div.className = 'ostanati' 
          let span = document.createElement('span')
          span.className = 'hH4'
          span.setAttribute('name', 'naslov')
          span.innerHTML = `${k.imeKirilica}`
          let input_3 = document.createElement('input')
          input_3.type = 'hidden'
          input_3.name = 'imeKirilica'
          input_3.value = `${k.imeKirilica}`
          let input_1 = document.createElement('input')
          input_1.type = 'hidden'
          input_1.name = 'imeLatinica'
          input_1.value = `${k.imeLatinica}`
          let input_2 = document.createElement('input')
          input_2.type = 'hidden'
          input_2.name = 'oddel'
          input_2.value = `${k._id}`
          let button_1 = document.createElement('button')
          button_1.type = 'button'
          button_1.setAttribute('onclick', 'openModal(this, this.parentNode.querySelector(\'[name=oddel]\').value)')
          button_1.setAttribute('title', 'Креирајте нова подкатегорија')
          button_1.className= 'dDugme newFolder'
          let button_2 = document.createElement('button')
          button_2.type = 'button'
          button_2.setAttribute('title', 'Избриши ја категоријата')
          button_2.setAttribute('onclick', 'brisiDepartment(this, this.parentNode.querySelector(\'[name=oddel]\').value)')
          button_2.className= 'dDugme brisi'
          let button_3 = document.createElement('button')
          button_3.type = 'button'
          button_3.setAttribute('onclick', 'openModal(this, this.parentNode.querySelector(\'[name=oddel]\').value, this.parentNode.querySelector(\'[name=imeKirilica]\').value, this.parentNode.querySelector(\'[name=imeLatinica]\').value)')
          button_3.setAttribute('title', 'Изменете ја категоријата')
          button_3.className= 'dDugme edit' 
          let button_4 = document.createElement('button')
          button_4.type = 'button'
          button_4.setAttribute('onclick', 'newFile(this, this.parentNode.querySelector(\'[name=oddel]\').value)')
          button_4.setAttribute('title', 'Додај нов документ')
          button_4.className= 'dDugme file'
    
    
          div.appendChild(span)
          div.appendChild(input_3)
          div.appendChild(input_1)
          div.appendChild(input_2)
          div.appendChild(button_1)
          div.appendChild(button_2)
          div.appendChild(button_3)
          div.appendChild(button_4)
          append.appendChild(div)

        }
        
      closeModal();

      }
      if (odgovor.status === 201) {
        let k = await odgovor.json()
        edit = k.edit
        append.querySelector('[name=imeKirilica]').value = k.imeKirilica
        append.querySelector('[name=imeLatinica]').value = k.imeLatinica
        append.querySelector('[name=naslov]').innerHTML = k.imeKirilica
        closeModal();
      }

    }
    catch{

    }
  } 