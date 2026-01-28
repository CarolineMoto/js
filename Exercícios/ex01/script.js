function carregar() {
    var msg = window.document.getElementById('msg')
    var img = window.document.getElementById('imagem')
    var data = new Date() 
    
    var hora = data.getHours()
    var minutos = data.getMinutes()

   
    if (minutos < 10) {
        minutos = '0' + minutos
    }
    
    if (hora >= 0 && hora < 12) {
        msg.innerHTML = `Bom dia!<br> Agora são ${hora} horas e ${minutos} minutos.`
        img.src = 'modelos/manha.png'
        document.body.style.background = '#ecc575'
    } else if (hora >= 12 && hora < 18) {
        msg.innerHTML = `Boa tarde!<br> Agora são ${hora} horas e ${minutos} minutos.`
        img.src = 'modelos/tarde.png'
        document.body.style.background = '#a7763d'
    } else {
        msg.innerHTML = `Boa noite!<br> Agora são ${hora} horas e ${minutos} minutos.`
        img.src = 'modelos/noite.png'
        document.body.style.background = '#37353c'
    }
}