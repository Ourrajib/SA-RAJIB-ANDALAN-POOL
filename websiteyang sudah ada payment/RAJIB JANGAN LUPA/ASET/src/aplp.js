document.addEventListener('alpine:init', () => {
        Alpine.data('products', () => ({
      items:[
      { id: 1, name: 'Capucino', img:'1.jpg',price: 20000},
            { id: 2, name: 'caramel',img:'2.png',price:20000},
                  { id: 3, name: 'Robustas cido',img:'3.png',price:20000},
      { id: 4, name: 'Capucino',img:'5.jpg',price:20000},
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
   const token = await Response.text();
 } catch(err) {
   console.log(err.message);
 }
 
 console.log(token);
/* window.snap.pay('TRANSACTION_TOKEN_HERE');*/
});

// format pesan WhatsApp 
const formatMessage = (obj) => {
  return `Data Customer
   Nama: ${obj.name}
   Email: ${obj.email}
   No Hp: ${obj.phone}
   Alamat: ${obj.alamat}
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