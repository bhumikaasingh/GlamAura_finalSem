import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// import { singleProductApi, updateProduct } from '../../apis/Api';
import { toast } from 'react-toastify';
import { singleProductApi, updateProductApi } from '../../api/Api';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'


const AdminProductUpdate = () => {
    // get id from url
    const { id } = useParams()

    // get product information (Backend)
    useEffect(() => {
        singleProductApi(id).then((res) => {
            console.log(res.data);
            setProductName(res.data.product.productName)
            setProductPrice(res.data.product.productPrice)
            setProductCategory(res.data.product.productCategory)
            setProductDescription(res.data.product.productDescription)
            setOldImage(res.data.product.productImage)

        }).catch((error) => {
            console.log(error)
        })
    }, [])

    // fill all the info in each fields

    // make a use state
    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [productDescription, setProductDescription] = useState('')

    // state for image
    const [productNewImage, setProductNewImage] = useState(null)
    const [previewNewImage, setPreviewNewImage] = useState(null)
    const [oldImage, setOldImage] = useState('')

    // image upload handler
    const handleImage = (event) => {
        const file = event.target.files[0]
        setProductNewImage(file) // for backend
        setPreviewNewImage(URL.createObjectURL(file))
    }


    //update product function 
    const handelUpdate =(e)=>{
        e.preventDefault()

        //make a form data 
        const formData=new FormData();
        formData.append('productName', productName)
        formData.append('productPrice', productPrice)
        formData.append('productCategory', productCategory)
        formData.append('productDescription', productDescription)


        if (productNewImage){
            formData.append('productImage',productNewImage)
        }

        //api call 
        updateProductApi(id,formData).then((res)=>{
            if (res.status===200){
                toast.success(res.data.message)
            }
        }).catch((error)=>{
            if(error.response.status===500){
                toast.error(error.response.data.message)
            }else if (error.response.status===400){
                toast.warning(error.response.data.message)
            }
        })
    }

    return (
        <>
            <div className='container mt-3'>

            <div className='my-3'>
            < AdminNavbar />
        </div>

                <h2>Update product for <span className='text-danger'>'Flower'</span></h2>

                <div className='d-flex gap-3'>
                    <form action="">
                        <label htmlFor="">Product Name</label>
                        <input onChange={(e) => setProductName(e.target.value)} className='form-control' type="text" placeholder='Enter your product name' value={productName} />

                        <label className='mt-2' htmlFor="">Product Price</label>
                        <input onChange={(e) => setProductPrice(e.target.value)} className='form-control' type="number" placeholder='Enter your product name' value={productPrice} />

                        <label className='mt-2'>Choose category</label>
                        <select onChange={(e) => setProductCategory(e.target.value)} className='form-control' value={productCategory}>
                            <option value="Cosmetric">Cosmetric</option>
                            <option value="Skin care">Skincare</option>
                            
                        </select>

                        <label className='mt-2'>Enter description</label>
                        <textarea onChange={(e) => setProductDescription(e.target.value)} className='form-control' value={productDescription}></textarea>

                        <label className='mt-2'>Choose product Image</label>
                        <input onChange={handleImage} type="file" className='form-control' />

                        <button onClick={handelUpdate} className='btn btn-danger w-100 mt-2'>Update Product</button>

                    </form>
                    <div className='image section'>
                        <h6>Old Image Preview</h6>
                        <img className='object-fit-cover rounded-4' height={'300px'} width={'300px'} src={`http://localhost:5500/products/${oldImage}`} />
                        {
                            previewNewImage && <div>
                                <h6>New Image Preview</h6>
                                <img src={previewNewImage} className='object-fit-cover rounded-4' height={'300px'} width={'300px'} alt="" />
                            </div>
                        }
                    </div>
                </div>

            </div>
        </>
    )
}

export default AdminProductUpdate
