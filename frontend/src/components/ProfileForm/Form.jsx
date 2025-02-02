import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserApi, profileUserApi } from '../../api/Api';
import { toast } from 'react-toastify';

const Form = () => {
  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem('user'))._id;
  console.log(id)

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    location: '',
    profileImage: null,
    previewNewImage: null, // State for previewing new image
  });

  useEffect(() => {
    profileUserApi(id)
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          const userData = res.data.user;
          setUser({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            contactNumber: userData.contactNumber || '',
            email: userData.email || '',
            location: userData.location || '',
            profileImage: userData.profileImage || null, // Clear any existing profile picture when loading data
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    setUser({
      ...user,
      profileImage: file,
      previewNewImage: URL.createObjectURL(file), // Set preview image URL
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('contactNumber', user.contactNumber);
    formData.append('email', user.email);
    formData.append('location', user.location);
    if (user.profileImage) {
      formData.append('profileImage', user.profileImage);
    }

    updateUserApi(id, formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate('/profile');
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 400) {
          toast.warning(error.response.data.message);
        }
      });
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='flex flex-col w-full m-4 items-center'>
      <div className='flex'>
        <div className='image mb-2'>
          <img
            src={
              user.previewNewImage ||
              (user.profileImage
                ? `http://localhost:5500/profile/${user.profileImage}`
                : 'https://cdn-icons-png.flaticon.com/128/6997/6997662.png')
            }
            className='rounded-full w-32 h-32'
            alt='Avatar'
          />
        </div>
        <div className='flex flex-col form-group mb-2'>
          <label htmlFor='profileImage' className='mb-2'>
            Profile Picture <br />
          </label>
          <input
            type='file'
            id='profileImage'
            name='profileImage'
            className='px-4 py-2 rounded-xl border w-80'
            onChange={handleImage}
          />
        </div>
      </div>

      <div className='flex flex-col form-group mb-2'>
        <label htmlFor='firstName' className='mb-2'>
          First Name{' '}
        </label>
        <input
          type='text'
          id='firstName'
          name='firstName'
          className='px-4 py-2 rounded-xl border w-80'
          placeholder='Enter your first name'
          value={user.firstName}
          onChange={handleChange}
        />
      </div>
      <div className='flex flex-col form-group mb-2'>
        <label htmlFor='lastName' className='mb-2'>
          Last Name{' '}
        </label>
        <input
          type='text'
          id='lastName'
          name='lastName'
          className='px-4 py-2 rounded-xl border w-80'
          placeholder='Enter your last name'
          value={user.lastName}
          onChange={handleChange}
        />
      </div>
      <div className='flex flex-col form-group mb-2'>
        <label htmlFor='number' className='mb-2'>
          Contact Number <br />
        </label>
        <input
          type='number'
          id='number'
          name='contactNumber'
          className='px-4 py-2 rounded-xl border w-80'
          placeholder='Enter your number'
          value={user.contactNumber}
          onChange={handleChange}
        />
      </div>

      <div className='flex flex-col form-group mb-2'>
        <label htmlFor='email' className='mb-2'>
          Email <br />
        </label>
        <input
          type='email'
          id='email'
          name='email'
          className='px-4 py-2 rounded-xl border w-80'
          placeholder='Enter your email'
          value={user.email}
          onChange={handleChange}
        />
      </div>

      <div className='flex flex-col form-group mb-2'>
        <label htmlFor='location' className='mb-2'>
          Location <br />
        </label>
        <input
          type='text'
          id='location'
          name='location'
          className='px-4 py-2 rounded-xl border w-80'
          placeholder='Enter your location'
          value={user.location}
          onChange={handleChange}
        />
      </div>

      <div className='button-group'>
        <button
          className='bg-black text-white px-4 py-2 rounded-xl mr-2'
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className='bg-black text-white px-4 py-2 rounded-xl'
          onClick={handleLogOut}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Form;
