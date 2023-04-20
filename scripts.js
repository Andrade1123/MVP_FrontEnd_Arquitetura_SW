/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

/* Coloca os elementos da página em variáveis */
const formulario = document.getElementById("formulario");
const carregando = document.getElementById('carregando');
const semRoupas = document.getElementById("sem-roupas");
const tabela = document.getElementById("tabela-de-roupas");

const getList = async () => {
    let url = 'http://127.0.0.1:5000/roupas';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        // esconde a mensagem de carregando
        carregando.classList.add('escondido');
        
        if(data.roupas.length === 0){
          //se a lista de roupas estiver vazia, exibe a mensagem de que não existem roupas cadastradas
          semRoupas.classList.remove('escondido');
        } else {
          //se a lista de roupas possuir itens, exibe a tabela de roupas
          tabela.classList.remove('escondido');
          data.roupas.forEach(item => insertList(item.categoria, item.tamanho, item.quantidade, item.valor, item.id))
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Chamada da função para carregamento inicial dos dados
    --------------------------------------------------------------------------------------
  */
  getList()
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (inputCategoria, inputQuantidade, inputValor, inputTamanho) => {
    
    //cria os dados no formato de formulario pra enviar pro servidor
    const formData = new FormData();
    formData.append('categoria', inputCategoria);
    formData.append('tamanho', inputTamanho);
    formData.append('quantidade', inputQuantidade);
    formData.append('valor', inputValor);
  
    let url = 'http://127.0.0.1:5000/roupa';
    fetch(url, {
      method: 'post',
      body: formData
    })
    .then((response) => response.json())
    .then((data) => {
      semRoupas.classList.add('escondido');
      tabela.classList.remove('escondido');
      // insere a nova roupa criada na tabela
      insertList(data.categoria, data.tamanho, data.quantidade, data.valor, data.id);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const nomeItem = div.getElementsByTagName('td')[0].innerHTML
        if (confirm("Você tem certeza?")) {
          div.remove()
          deleteItem(nomeItem)
          alert("Removido!")
        }
      }
    }
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para deletar um item da lista do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deleteItem = (id, row) => {
    let url = 'http://127.0.0.1:5000/roupa?id=' + id;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Item deletado");
        row.remove();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para adicionar um novo item com nome, quantidade e valor 
    --------------------------------------------------------------------------------------
  */
  const newItem = (e) => {
    //previne que o formulário atualize a página ao ser enviado.
    e.preventDefault();

    // pega os valores do formulário
    let inputCategoria = document.getElementById("categoria").value;
    let inputQuantidade = document.getElementById("quantidade").value;
    let inputValor = document.getElementById("valor").value;
    let inputTamanho = document.getElementById("tamanho").value;

    // Envia o novo item para o servidor.
    postItem(
      inputCategoria,
      inputQuantidade,
      inputValor,
      inputTamanho
    );
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */
  const insertList = (categoria, tamanho, quantidade, valor, id) => {
    var item = [categoria, tamanho, quantidade, valor];
    // insere uma nova linha na tabela
    var row = tabela.insertRow();
  
    for (var i = 0; i < item.length; i++) {
      // insere os items do array como colunas da linha "row"
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }

    const colunaDoBotaoDeDeletar = row.insertCell(-1);
    
    colunaDoBotaoDeDeletar.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/126/126468.png" width="15px" height="15px"/>';
    colunaDoBotaoDeDeletar.onclick = () => deleteItem(id, row);

    document.getElementById("categoria").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("tamanho").value = "";
  
    //removeElement()
  }

  formulario.onsubmit = newItem;