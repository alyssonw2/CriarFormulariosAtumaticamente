const CriadorFormulario = {
    async PegandoConfiguracaoTabelaBD(nomeBanco){
        const options = {
            method: 'POST',
            url: 'http://192.168.2.66:7887/query',
            headers: {'Content-Type': 'application/json'},
            data: {query: 'DESCRIBE `'+nomeBanco+'`', database: 'cadastrocliente'}
          };
          ret =  await axios.request(options)
          return ret
    },
    async MontandoEstruturaHTMLTabela(nomeBanco,posicoes){
        let estruturaBd = await this.PegandoConfiguracaoTabelaBD(nomeBanco)
        let html = ''
        let type = ''
        let Typeinput = ''
        let input = ''
        for (let index = 0; index < estruturaBd.data.length; index++) {
            Typeinput =  estruturaBd.data[index].Type
           // console.log( estruturaBd.data[index].Type)
            if(Typeinput == 'longtext'){input = 'textArea'}
            if(Typeinput == 'text' || Typeinput == 'varchar' ){input = 'input'}
            if(index == 0){html += '<form class="row">'}
            else{
                switch (estruturaBd.data[index].Type) {
                    case 'text':
                        type = 'type="text" class="form-control"'
                        break;
                    case 'int(255)':
                            type = 'type="tel" class="form-control"'
                        break;
                    case 'varchar(25)':
                            type = 'type="number" class="form-control"'
                        break;    
                    case 'date':
                            type = 'type="date" class="form-control"'
                        break;   
                    case 'tinyint(1)':
                            type = 'type="checkbox" class="form-check-input"'
                        break;         
                    case 'longtext':
                        type = 'type="text" class="form-control"'
                        break;
                    default: 
                    type = 'text'
                        break;
                } 
                if(estruturaBd.data[index].Default == null){
                    html += `
                    <div class="${posicoes[index]}">
                        <label for="${estruturaBd.data[index].Field.replaceAll("'",'').replaceAll("\\",'')}" class="form-label"></label>
                        <${input} ${type} id="${estruturaBd.data[index].Field}" aria-describedby="emailHelp"></${input}>
                        <div id="${estruturaBd.data[index].Field}" class="form-text"> ${estruturaBd.data[index].Field.replaceAll("'",'').replaceAll("\\\\",'')} </div>
                    </div>`
                }
                else{
                    html += ` 
                    <div class="${posicoes[index]}">
                    <label for="${estruturaBd.data[index].Field}" class="form-label">${estruturaBd.data[index].Default.replaceAll("'",'').replaceAll("\\",'')}</label>
                    <${input} ${type}  id="${estruturaBd.data[index].Field}" aria-describedby=""></${input}>
                    <div id="${estruturaBd.data[index].Field}" class="form-text"> ${estruturaBd.data[index].Field.replaceAll("'",'').replaceAll("\\\\",'')} </div>
                    </div>`
                }
            }
        }
        html += '</form>'
        return html
    },
    async RenderizandoComponente(html,compoente){
        document.querySelector(`${compoente}`).innerHTML =  html
    }
}
async function GerFormulario(Tabela,Configuracao,compoente) {
    CriadorFormulario.MontandoEstruturaHTMLTabela(Tabela,Configuracao)
        .then(ret=>{       
            CriadorFormulario.RenderizandoComponente(ret,compoente)
        })
        .catch(ret=>{console.error(ret)})
}
//Posições organização itens
let organizacaoForm = ['','col-sm-12 col-md-12','col-sm-12 col-md-3','col-sm-12 col-md-9','col-sm-12 col-md-3']
//rodando a função no banco de dados
// Nome do banco , organização , compoente que recebera o formulário
GerFormulario('Clientes',organizacaoForm,'app')
//GerFormulario('ordemservico',organizacaoForm,'app')