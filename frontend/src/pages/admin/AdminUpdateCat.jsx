import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { singleCategoryApi, updateCategoryApi } from '../../api/Api';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'


const AdminCategoryUpdate = () => {
    const { id } = useParams(); // Get the category ID from the URL
    const history = useNavigate();
    
    const [name, setName] = useState('');
    const [details, setDetails] = useState('');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        // Fetch the category details by ID
        singleCategoryApi(id).then((res) => {
            if (res.status === 200) {
                const category = res.data.category;
                setName(category.name);
                setDetails(category.details);
                setCurrentImage(category.image); // Current image from the database
            }
        }).catch((error) => {
            toast.error("Failed to load category data.");
        });
    }, [id]);

    const handleImage = (event) => {
        const file = event.target.files[0];
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('details', details);
        if (image) formData.append('image', image);

        updateCategoryApi(id, formData).then((res) => {
            if (res.status === 200) {
                toast.success("Category updated successfully!");
                history.push('/admin/categories'); // Redirect to categories list
            }
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                toast.error("Bad Request: Please check your input.");
            } else if (error.response && error.response.status === 500) {
                toast.error("Internal Server Error");
            }
        });
    };

    return (
        <div className="container">
            <div className='my-3'>
            < AdminNavbar />
        </div>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h2>Edit Category</h2>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Category Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Category Description</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={details} 
                                onChange={(e) => setDetails(e.target.value)} 
                            />
                        </div>
                        <div className="form-group">
                            <label>Category Image</label>
                            <input 
                                type="file" 
                                className="form-control" 
                                onChange={handleImage} 
                            />
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" width="100" />
                            ) : (
                                <img src={`http://localhost:5500/categories/${currentImage}`} alt="Current" width="100" />
                            )}
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Save</button>
                            <button type="button" className="btn btn-secondary ml-2" onClick={() => history.push('/admin/categories')}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};




export default AdminCategoryUpdate
