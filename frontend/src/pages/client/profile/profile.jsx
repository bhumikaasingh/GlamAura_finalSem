import React from 'react'
import Form from '../../../components/ProfileForm/Form'

const profile = () => {
  return (
    <div style={{backgroundImage: 'url("assets/images/profile.jpg")'
    ,height:'full'
    ,width:'full'
    ,backgroundSize:'cover'
    ,backgroundRepeat:'no-repeat'}} className='h-screen w-screen'
    >
        <div className='w-1/2 items-center mt-32 border-r-4 border-black'>
        < Form />
        

        </div>
      
    </div>
  )
}

export default profile
