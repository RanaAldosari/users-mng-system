import React from 'react'
import Swal from 'sweetalert2';
// handel with uses***
function PrincplePage() {
// accept
  function AcceptLeaves(){
    Swal.fire({
      icon: 'success',
      title: 'Accepted Successfully',
      timer: 1500,
      showConfirmButton: false
    });
  }
// reject
  function RejectLeaves(){
    Swal.fire({
      title: 'Rejected Reason',
      input: 'text',
      inputPlaceholder: ' Please Write the rejected resone',
      showCancelButton: true,
      confirmButtonText: 'send',
      cancelButtonText: 'cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'rejected reasone'
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'info',
          title: 'rejected is sended',
          text: `reasone is:${result.value}`,
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  return (
 <>
 <div>
    {/* get leaves from student */}
    <h2>Leaver:</h2>
       <div className='border p-4 space-y-3 max-w-md'>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, sint. Praesentium nisi veritatis illo, labore, quibusdam impedit quaerat dicta et voluptatem quisquam, odit nam cumque incidunt velit optio quae consequuntur!</p>
      <button onClick={AcceptLeaves} className='bg-green-400 text-white px-4 py-1 rounded mr-3'>Accept</button>
      <button onClick={RejectLeaves} className='bg-red-500 text-white px-4 py-1 rounded'>Reject</button>
    </div>
    <h2>report:</h2>
    <h2>??</h2>
 </div>
 </>
  )
}

export default PrincplePage