import React, { useState, useEffect } from 'react'
// import { createProductApi, deleteProduct, getAllProducts } from '../../apis/Api'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { createProductApi, deleteProductApi, productApi } from '../../api/Api'
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'
 
const AdminDashboard = () => {
 
   
    const [products, setProducts] = useState([])
 
    useEffect(() => {
 
        productApi().then((res) => {
           
            setProducts(res.data.products)
 
        }).catch((error) => {
            console.log(error)
        })
 
 
    }, [])
 
    console.log(products)
 
 
 
    // Making a state for product
    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [productDescription, setProductDescription] = useState('')
 
    // Image state
    const [productImage, setProductImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
 
    // function to upload and preview image
    const handleImageUpload = (event) => {
        // 0-File, 1-name, 2-Size
        const file = event.target.files[0]
        setProductImage(file)
        setPreviewImage(URL.createObjectURL(file))
    }
 
    // Delete Product
    const handleDelete = (id) => {
        const confirmDialog = window.confirm("Are you sure want to delete?")
        if(confirmDialog){
            // Delete product
 
            deleteProductApi(id).then((res) => {
                if(res.status === 201){
                    toast.success(res.data.message)
                    window.location.reload()
                }
            }).catch((error) => {
                if(error.response.status === 500){
                    toast.error(error.response.data.message)
                }
 
                else if(error.response.status === 400){
                    toast.error(error.response.data.message)
                }
            })
 
        }
 
    }
 
    // handle submit
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(productName, productPrice, productCategory, productDescription, productImage)
 
 
        // make a logical form data
        const formData = new FormData()
        formData.append('productName', productName)
        formData.append('productPrice', productPrice)
        formData.append('productCategory', productCategory)
        formData.append('productDescription', productDescription)
        formData.append('productImage', productImage)
 
        // make a api call/request
        createProductApi(formData).then((res) => {
            if (res.status === 201) {
                toast.success(res.data.message)
            } else {
                toast.error("Something went wrong in frontend!")
            }
        }).catch((error) => {
 
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.message)
                }
                // space for 401 error
 
            } else if (error.response.status === 500) {
                toast.error("Internal server error")
            } else {
                toast.error("No response!!")
            }
 
        })
 
    }
 
 
 
    return (
        <>
            <div className='container'>
            <div className='my-3'>
            < AdminNavbar />
        </div>
 
                <div className='d-flex justify-content-between mt-2'>
                    <h2>Admin Dashboard</h2>
 
 
                    <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Add Product
                    </button>
 
 
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Create a new product!</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
 
                                    <form action="">
 
                                        <label>Product Name</label>
                                        <input onChange={(e) => setProductName(e.target.value)} type="text" className='form-control' placeholder='Enter product Name' />
 
                                        <label className='mt-2'>Product Price</label>
                                        <input onChange={(e) => setProductPrice(e.target.value)} type="number" className='form-control' placeholder='Enter product Price' />
 
                                        <div className='mt-2'>
                                            <label>Select Category</label>
                                            <select onChange={(e) => setProductCategory(e.target.value)} className='form-control'>
                                                <option value="Cosmetric">Cosmetric</option>
                                                <option value="Skincare">Skin Care</option>
                                                
                                            </select>
                                        </div>
 
                                        <label className='mt-2'>Type product description</label>
                                        <textarea onChange={(e) => setProductDescription(e.target.value)} className='form-control'></textarea>
 
                                        <label className='mt-2'>Product Image</label>
                                        <input onChange={handleImageUpload} type="file" className='form-control' />
 
                                        {/* Preview Image */}
                                        {
                                            previewImage && (
                                                <div className=''>
                                                    <img src={previewImage} alt="preview image" className='img-fluid rounded object-fit-cover mt-3' />
                                                </div>
                                            )
                                        }
 
                                    </form>
 
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button onClick={handleSubmit} type="button" class="btn btn-primary">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
 
                </div>
 
                <table className='table mt-3'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Product Image</th>
                            <th>Product Name</th>
                            <th>Product Price</th>
                            <th>Product Category</th>
                            <th>Product Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
 
                        {
                            products.map((singleProduct) => (
                                <tr>
                                    <td>
                                        <img height={'40px'} width={'40px'} src={`http://localhost:5500/products/${singleProduct.productImage}`} alt="" />
                                    </td>
                                    <td>{singleProduct.productName}</td>
                                    <td>NPR.{singleProduct.productPrice}</td>
                                    <td>{singleProduct.productCategory}</td>
                                    <td>{singleProduct.productDescription}</td>
                                    <td>
                                        <div className='btn-group' role='group'>
                                            <Link to={`/admin/product/update/${singleProduct._id}`} className='btn btn-success'>Edit</Link>
                                            <button onClick={()=> handleDelete(singleProduct._id)} className='btn btn-danger'>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
 
                    </tbody>
                </table>
 
            </div>
        </>
    )
}
 
export default AdminDashboard
 
 
 
 
