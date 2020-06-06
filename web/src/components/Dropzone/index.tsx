import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import './styles.css'

interface Props {
    onFileUploaded: (file: File) => void // é esperado uma função sem retorno
}

const Dropzone: React.FC<Props> = (props) => {

    const [selectedFileUrl, setselectedFileUrl] = useState('') // variável estado para mostrar imagem de upload

    const onDrop = useCallback(acceptedFiles => {

        const file = acceptedFiles[0] // como é apenas uma foto, posição zero do array

        const fileUrl = URL.createObjectURL(file)

        setselectedFileUrl(fileUrl) // altera estado da variável

        props.onFileUploaded(file) // propriedade recebida do componente

    }, [props.onFileUploaded]) // se a função mudar, recalcula toda a função

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />
            { selectedFileUrl
                    ? 
                <img src={selectedFileUrl} alt="Foto do estabelecimento"/> 
                    : 
                (
                <p>
                        <FiUpload />
                        Imagem do estabelecimento ...    
                </p>
                )
            }
        </div>
    )
}

export default Dropzone