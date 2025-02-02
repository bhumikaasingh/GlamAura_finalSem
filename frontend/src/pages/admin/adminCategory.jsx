import React, {useState, useEffect} from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { categoryApi, deleteCategoryApi, createCategoryApi } from '../../api/Api'
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'

const AdminCategory = () => {



    const [categories, setCategories] = useState([])

    useEffect(() => {

        // get all categories
        categoryApi().then((res) => {
            console.log(res.data)
            setCategories(res.data.categories)
        }
        ).catch((error) => {
            console.log(error)
        })
      }, [])


      const [categoryName, setCategoryName] = useState('')
      const [categoryDescription, setCategoryDescription] = useState('')
      const [categoryImage, setCategoryImage] = useState(null)
      const [previewImage, setPreviewImage] = useState(null)

      const handleImage = (event) => {
          const file = event.target.files[0]
          setCategoryImage(file)
          setPreviewImage(URL.createObjectURL(file))
      }

      const handleDelete = (id) => {
          const confirmDialog = window.confirm("Are you sure want to delete?")
          if(confirmDialog){
              // Delete product

              deleteCategoryApi(id).then((res) => {
                  if(res.status === 201){
                      toast.success(res.data.message)
                      window.location.reload()
                  }
              }).catch((error) => {
                  if(error.response.status === 500){
                      toast.error(error.response.data.message)
                  }
              })
          }
      }

      const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('details', categoryDescription);
        formData.append('image', categoryImage);
    
        createCategoryApi(formData).then((res) => {
            if (res.status === 201) {
                toast.success(res.data.message);
                window.location.reload();
            }
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                toast.error("Bad Request: Please check your input.");
            } else if (error.response && error.response.status === 500) {
                toast.error("Internal Server Error");
            }
        });
    }
    


    
  return (


        <div className="container">

        <div className='my-3'>
            < AdminNavbar />
        </div>


            <div className="row">
                <div className="col-md-6">
                    <h2>Create Category</h2>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Category Name</label>
                            <input type="text" className="form-control" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Category Description</label>
                            <input type="text" className="form-control" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Category Image</label>
                            <input type="file" className="form-control" onChange={handleImage} />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
                <div className="col-md-6">
                    <h2>Categories</h2>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Category Description</th>
                                <th>Category Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category._id}>
                                    <td>{category.name}</td>
                                    <td>{category.details}</td>
                                    <td><img src={`http://localhost:5500/categories/${category.image}`} alt={category.name} width="50" /></td>
                                    <td>
                                        <Link to={`/admin/category/update/${category._id}`} className="btn btn-primary">Edit</Link>
                                        <button onClick={() => handleDelete(category._id)} className="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      
  )
}

export default AdminCategory
