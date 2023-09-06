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

  const updateList = () => {
    tabela.innerHTML = `
      <tr>
        <th>Categoria</th>
        <th>Tamanho</th>
        <th>Quantidade</th>
        <th>Valor</th>
        <th>Editar</th>
        <th>Deletar</th>
      </tr>
    `;
    getList();
  }

  const editItem = (id, categoria, tamanho, quantidade, valor) => {
    const containerFormularioDeEdicao = document.getElementById('container-formulario-edicao');
    const formularioDeEdicao = document.getElementById('formulario-edicao');
    const botaoDeCancelar = formularioDeEdicao.getElementsByClassName('cancelBtn')[0];

    botaoDeCancelar.onclick = () => containerFormularioDeEdicao.classList.add('escondido');
    
    const inputDeCategoria = document.getElementsByName('categoria')[0];
    const inputDeTamanho = document.getElementsByName('tamanho')[0];
    const inputDeQuantidade = document.getElementsByName('quantidade')[0];
    const inputDeValor = document.getElementsByName('valor')[0];

    inputDeCategoria.value = categoria
    inputDeTamanho.value = tamanho
    inputDeQuantidade.value = quantidade
    inputDeValor.value = valor

    containerFormularioDeEdicao.classList.remove('escondido');
    
    formularioDeEdicao.onsubmit = (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      formData.append('id', id);

      let url = 'http://127.0.0.1:5000/roupa';
      fetch(url, {
        method: 'PUT',
        body: formData
      })
      .then((response) => response.json())
      .then((data) => {
        containerFormularioDeEdicao.classList.add('escondido');
        updateList();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
    Função para adicionar um novo item com categoria, tamanho, quantidade e valor 
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

    const colunaDoBotãoDeEditar = row.insertCell(-1);
    colunaDoBotãoDeEditar.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/1827/1827951.png" width="15px" height="15px"/>';
    colunaDoBotãoDeEditar.onclick = () => editItem(id, categoria, tamanho, quantidade, valor);

    const colunaDoBotaoDeDeletar = row.insertCell(-1);
    colunaDoBotaoDeDeletar.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/126/126468.png" width="15px" height="15px"/>';
    colunaDoBotaoDeDeletar.onclick = () => deleteItem(id, row);

    document.getElementById("categoria").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("tamanho").value = "";
  }

  formulario.onsubmit = newItem;