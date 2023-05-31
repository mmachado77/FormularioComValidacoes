const form = document.getElementById('clienteForm')
const erros = document.getElementById('erros')
const agene = document.getElementById('sexo3')
const masc = document.getElementById('sexo1')
const fem = document.getElementById('sexo2')
const genero = document.getElementById('outroGenero')


form.addEventListener('submit', function eventoForm(e){
  e.preventDefault()
  erros.innerHTML = ''
  const cpf = document.getElementById('cpf').value
  const email = document.getElementById('email').value
  let validacao = new ValidaCPF(cpf)
  const msgErro = document.createElement('p')
  let txtError = ''
    if (validacao.valida() && validaEmail(email) && validaCheckboxes()) { //ABC CERTOS
      e.target.submit()
    } else {
      if (!validacao.valida() && !validaEmail(email) && !validaCheckboxes()) { ///ABC ERRADOS
        txtError = '• CPF Inválido, Email Inválido e ao menos uma preferência deve ser selecionada!'
    } else {
        if (!validacao.valida()) { //A ERRADO
            txtError = '• CPF Inválido!'
        }
        if (!validaEmail(email)) { //B ERRADO
            txtError = '• Email Inválido!'
        }
        if (!validaCheckboxes()) { //C ERRADO
            txtError = '• Ao menos uma preferência deve ser selecionada!'
        }
        if(!validacao.valida() && !validaEmail(email)){ //AB ERRADOS
            txtError = '• CPF e Email Inválidos!'
        }
        if(!validacao.valida() && !validaCheckboxes()){ //AC ERRADOS
            txtError = '• CPF Inválido e ao menos uma preferência deve ser selecionada!'
        }
        if(!validaEmail(email) && !validaCheckboxes()){ //BC ERRADOS
            txtError = '• Email Inválido e ao menos uma preferência deve ser selecionada!'
        }
    }
  msgErro.textContent = txtError
  erros.appendChild(msgErro)
    }
})

function validaCheckboxes() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        return true;
      }
    }
    return false;
}
  

function validaEmail(x){
  const emailPadrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPadrao.test(x)
}

let criarAgene = false;
agene.addEventListener('click', function eventoAgene(e){
    if(criarAgene==true){
        return;
    } else{
      sexo3();
    }
})

masc.addEventListener('click', function apagaBoxM(e){
    genero.innerHTML = ''
    criarAgene = false
})

fem.addEventListener('click', function apagaBoxF(e){
    genero.innerHTML = ''
    criarAgene = false
})

function sexo3(){
    const outro = document.createElement('input')
    const digite = document.createElement('p')
    digite.textContent = "Digite seu Gênero: "
    outro.name = "sexoAgene"
    outro.id = "sexoAgene"
    outro.type = "text"
    outro.required = true
    outro.style.width = "90%"
    outro.maxLength = "30"
    criarAgene = true
    genero.append(digite)
    genero.append(outro)
}

function onlyNumberKey(evt) {        
  var ASCIICode = (evt.which) ? evt.which : evt.keyCode
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
      return false;
  return true;
}


class ValidaCPF {
  
  constructor(cpfEnviado) {
      Object.defineProperty(this, 'cpfLimpo', {
          enumerable: false,
          value: cpfEnviado.replace(/\D+/g, '')
      })
  }
  
  isSequence() {
      return this.cpfLimpo.charAt(0).repeat(11) === this.cpfLimpo;
  }

  geraNovoCpf() {
      const cpfSemDigitos = this.cpfLimpo.slice(0, -2);
      const digito1 = ValidaCPF.geraDigito(cpfSemDigitos);
      const digito2 = ValidaCPF.geraDigito(cpfSemDigitos + digito1);
      this.novoCPF = cpfSemDigitos + digito1 + digito2;
  }

  static geraDigito(cpfSemDigitos) {
      let total = 0;
      let reverso = cpfSemDigitos.length + 1;

      for (let stringNumeros of cpfSemDigitos) {
          // console.log(typeof stringNumeros, stringNumeros)
          total += reverso * Number(stringNumeros);
          reverso--;
      }

      const digito = 11 - (total % 11);
      return digito <= 9 ? String(digito) : '0';
  }

  valida() {
      if(!this.cpfLimpo) return false;
      if(typeof this.cpfLimpo !== 'string') return false;
      if(this.cpfLimpo.length !== 11) return false;
      if(this.isSequence()) return false;
      this.geraNovoCpf();

      return this.novoCPF === this.cpfLimpo;
  }
}

function popularEstados() {
  var params = '{}';
  $.ajax({
      type: "GET",
      url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
      data: params,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg, status) {

          var regioes = new Array();
          regioes["Centro-Oeste"] = new Array();
          regioes["Nordeste"] = new Array();
          regioes["Norte"] = new Array();
          regioes["Sudeste"] = new Array();
          regioes["Sul"] = new Array();

          for (var i=0; i<msg.length; i++) {
              regioes[msg[i].regiao.nome].push(msg[i].sigla + "#" +msg[i].nome);
          }

          for (var prop in regioes) {
              regioes[prop].sort();
              $("#estado").append("<optgroup label=\""+prop+"\" id=\""+prop+"\" class=\"groupOption\"></optgroup>");
              for (var prop2 in regioes[prop]) {
                  $("#estado #"+prop).append("<option value=\""+regioes[prop][prop2].substring(0,2)+"\">"+regioes[prop][prop2].slice(3)+"</option>");
              }
          }   
          
      },
      error: function(xhr, msg, e) {
          alert(xhr.responseJSON.message);
          $("#municipio li.cid").remove();
      }
  });
}