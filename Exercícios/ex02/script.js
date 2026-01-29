function verificar() {
    var data = new Date()
    var ano = data.getFullYear()
    var fano = document.getElementById('txtano')
    var res = document.getElementById('res')

    if(fano.value.length == 0 || Number(fano.value > ano)) {
        window.alert('[ERRO] Verifique os dados e tente novamente!')
    } else {
        var fsex = document.getElementsByName('radsex')
        var idade = ano - Number(fano.value)
        var gênero = ''
        var img = document.createElement('img')
        img.setAttribute('id', 'foto')
        
        if (fsex[0].checked) {
            gênero = 'Homem'
            if (idade >=0 && idade < 2) {
                // Bebê
                img.setAttribute('src', 'imagens/menininho.png')
            } else if (idade < 12) {
                // Criança
                img.setAttribute('src', 'imagens/menino.png')
            } else if (idade < 18) {
                // Adolescente
                img.setAttribute('src', 'imagens/adolescentem.png')
            } else if (idade < 29) {
                // Jovem
                img.setAttribute('src', 'imagens/moço.png')
            } else if (idade < 59) {
                // Adulto
                img.setAttribute('src', 'imagens/homem.png')
            } else {
                // Idoso
                img.setAttribute('src', 'imagens/idoso.png')
            }
        } else if (fsex[1].checked) {
            gênero = 'Mulher'
            if (idade >=0 && idade < 2) {
                // Bebê
                img.setAttribute('src', 'imagens/menininha.png')
            } else if (idade < 12) {
                // Criança
                img.setAttribute('src', 'imagens/menina.png')
            } else if (idade < 18) {
                // Adolescente
                img.setAttribute('src', 'imagens/adolescentef.png')
            } else if (idade < 29) {
                //Jovem
                img.setAttribute('src', 'imagens/moça.png')
            } else if (idade < 59) {
                // Adulto
                img.setAttribute('src', 'imagens/mulher.png')
            } else {
                // Idoso
                img.setAttribute('src', 'imagens/idosa.png')
            }
        }
        res.innerHTML = `Detectamos ${gênero} com ${idade} anos.`
        res.appendChild(img)
    }
}