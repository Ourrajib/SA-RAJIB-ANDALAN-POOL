document.addEventListener('alpine:init', () => {
        Alpine.data('products', () => ({
      items:[
      { id: 1, name: 'Kaporit  60% Tijiwi 1Kg', img:'1.jpg',price: 33000},
      { id: 2, name: 'Tablet Beasar',img:'2.jpg',price:31000},
      { id: 3, name: 'Granular',img:'3.jpg',price:31000},      
      { id: 4, name: 'PAC Cina 1Kg',img:'4.jpg',price:16000},
     { id: 5, name: 'Soda Ash 1Kg',img:'5.jpg',price:12000},
      { id: 6, name: 'Trusi 1Kg',img:'6.jpg',price:53000},
        { id: 7, name: 'Leaf Skimmer finn standrt', img:'7.jpg',price:100000},
       { id: 8, name: 'Leaf Skimer Boots',img:'8.jpg',price:120000},
      
    ],
  }));
  
  Alpine.store('cart',{
    items: [],
    total: 0,
    quantity:0,
    add(newItem) {
      //cek apakah ada barang yang sama
      const cartItem = this.items.find((item) => item.id === newItem.id);
       // jika belum ada/cart masih kosong
       if (!cartItem) { 
         this.items.push({...newItem, quantity: 1, total: newItem.price});
         this.quantity++;
         this.total += newItem.price;
       } else {
         //jika barang nya udah ada, cek apakah barang beda atau sama dengan di cart 
         this.items = this.items.map((item) => {
           //jika varang berbeda 
           if (item.id !== newItem.id) {
             return item;
           } else {
             // jika barang sudah ada, tabmbah quantity dan totalnya
             item.quantity++;
             item.total = item.price * item.quantity;
             this.quantity++;
             this.total += item.price;
             return item;
             }
         });
       }
    
    },
        remove(id) {
      // ambil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);
      
      //jika item lebih dari 1
      if(cartItem.quantity > 1) {
        //telusuri 1 1
        this.items = this.items.map((item) => {
          //jika bukan barang yang diclik 
          if (item.id !== id) {
           return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
          this.total -= item.price;
          return item;
          }
        });
    
      
       } else if (cartItem.quantity === 1) {
      //jika barangnya sisa 1
      this.items = this.items.filter((item) => item.id !== id);
      this.quantity--;
      this.total -= cartItem.price;
    }
    },
  });
});


// Form Validation 
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup',function (e) {
  for(let i = 0; i < form.elements.length; i++){
    if(form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove('disabled');
      checkoutButton.classList.add('disabled');
      } else {
        return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove('disabled');
});
 
// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click',async function (e) {
  e.preventDefault();
  const  formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
 const message = formatMessage(objData);
 window.open('http://wa.me/6285716134720?text='+ encodeURIComponent(message));
 
 //minta transaction token mengunakan ajax / fetch
 try{
   const response =await fetch('php/placeOrder.php',{
     method: 'POST',
     body:data,
   });
   const token = await response.text();
//console.log(token);
// window.snap.pay(token)
 } catch(err) {
   console.log(err.message);
 }
 window.snap.pay('SNAP_TRANSACTION_TOKEN', {
  onSuccess: function(result){
    /* You may add your own implementation here */
    alert("payment success!"); console.log(result);
  },
  onPending: function(result){
    /* You may add your own implementation here */
    alert("wating your payment!"); console.log(result);
  },
  onError: function(result){
    /* You may add your own implementation here */
    alert("payment failed!"); console.log(result);
  },
  onClose: function(){
    /* You may add your own implementation here */
    alert('you closed the popup without finishing the payment');
  }
})

});

// format pesan WhatsApp 
const formatMessage = (obj) => {
  return `Data Customer
   Nama: ${obj.name}
   Email: ${obj.email}
   No Hp: ${obj.phone}
   No Hp: ${obj.alamat}
   Data Pesanan
 ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
TOTAL: ${rupiah(obj.total)}
Terima kasih.`;
};

//konversi ke Rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat('id-ID',{
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};
