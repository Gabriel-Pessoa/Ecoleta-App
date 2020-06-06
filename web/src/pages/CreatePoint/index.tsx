import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom' // SPA
import { FiArrowLeft } from 'react-icons/fi' // ícones
import { Map, TileLayer, Marker } from 'react-leaflet' // propreidades para funcionamento do mapa
import { LeafletMouseEvent } from 'leaflet'
import axios from 'axios' // importando o axios
import api from '../../services/api' // api do axios para dados do backend 
import Dropzone from '../../components/Dropzone' // importando dropzone para upload de imagem

import './styles.css'
import logo from '../../assets/logo.svg'

//sempre que o estado é um array ou objeto precisamos alterar manualmente o tipo da variável que vai ser armazenada
interface Item {
    id: number
    title: string
    image_url: string
    // lembrar descrever o tipo de variável para nota do produto
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const CreatePoint = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]) // tentar pegar long e lat aproximada do usuário
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]) // Tipagem e valor inicial. Posição selecionada no mapa. 

    const [items, setItems] = useState<Item[]>([]) // estado para alterar itens. Conceito de generic de typescript
    const [ufs, setUfs] = useState<string[]>([]) // estado para alterar ufs. Conceito de generic de typescrip dizendo que é um vetor de string
    const [cities, setCities] = useState<string[]>([])

    const [selectedUf, setSelectedUf] = useState('0') // state do estado
    const [selectedCity, setSelectedCity] = useState('0') // state da cidade
    const [selectedItems, setSelectedItems] = useState<number[]>([]) // state de seleção de itens

    const [selectedFile, setSelectedFile] = useState<File>() // variável que guarda imagem do upload


    const history = useHistory()


    useEffect(() => {
        // retorna a posição (lat e long) assim que abrir a aplicação
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords

            setInitialPosition([latitude, longitude]) // set posição inicial do map, baseado nas coordenadas do usuário
        })
    }, [])

    //chamando uma única vez os dados dos itens
    useEffect(() => {  // função que dispara o primeiro parâmetro, uma callback, delimitando o número de vezes dessa chamada, mesmo que o componente seja invocado n vezes 

        api.get('items').then(response => { //busca os itens no backend para renderizar no site
            setItems(response.data) // seta itens, respeitando o conceito de imutabilidade
        })

    }, [])

    // chamando uma única vez os dados das ufs
    useEffect(() => { // tipagem definida na interface que retorna um array

        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla) // percorre os dados das ufs , atribuindo a variável somente as siglas

            setUfs(ufInitials) // seta ufs respeitando o conceito de imutabilidade
        })

    }, [])

    // carregar as cidades sempre que UF mudar
    useEffect(() => {

        if (selectedUf === '0') return

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {

            const cityNames = response.data.map(city => city.nome)

            setCities(cityNames)
        })

    }, [selectedUf]) // permite executar toda vez que a variável mudar


    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) { // tipagem do tipescript
        const uf = event.target.value

        setSelectedUf(uf) // altera valor do estado
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value

        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target // desestrutura o nome e valor do target

        setFormData({ ...formData, [name]: value }) // clona objeto formData, altera valores específicos com nome específico e valor específicos
    }

    function handleSelectItem(id: number) {

        const alreadySelected = selectedItems.findIndex(item => item === id) // findindex procura na lista, se valor já existe, se existir, retorna a posição do valor

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)  //remove, filtrando por id de entrada da função

            setSelectedItems(filteredItems)

        } else {
            setSelectedItems([...selectedItems, id]) // adiciona
        }

    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData()

        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('uf', uf)
        data.append('city', city)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('items', items.join(','))

        if(selectedFile) data.append('image', selectedFile) // evitar submit sem imagem


        await api.post('points', data) // enviando dados para o backend

        alert('Ponto de coleta criado!')

        history.push('/') // ao submete formulário com sucesso redireciona usuário para home

    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange} />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange} />

                        </div>

                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} /> {/* ponteiro do mapa */}
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>

                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>

                                <option value="0">Selecione uma UF</option>

                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}

                            </select>
                        </div>

                        <div className="field">

                            <label htmlFor="city">Cidade</label>

                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>

                                <option value="0">Selecione uma cidade</option>

                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}

                            </select>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>
                    <ul className="items-grid">

                        {items.map(item => (
                            //sempre que utilizamos um método que percorre um objeto interável como um array ou objeto, o rect precisa que ele tenha um key único para cada um desses elementos para achar esse elemeneto mais rápido
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''} //teste para add class selected que modifica o css
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>

        </div>
    )
}

export default CreatePoint