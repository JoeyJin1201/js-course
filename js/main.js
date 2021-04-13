document.addEventListener('DOMContentLoaded', () => {
  console.log('hello world');
  const baseURL = 'https://hexschoollivejs.herokuapp.com/api/livejs/v1';
  const api_path = 'joey1201';

  const getProductList = () => {
    const url = `${baseURL}/customer/${api_path}/products`;
    axios.get(url).then((response) => {
      // console.log(response.data.products);
      rendorProducts(response.data.products);
    });
  };

  const rendorProducts = (products) => {
    let productDOM = '';
    products.forEach((product) => {
      productDOM += `
                      <li class="productCard">
                        <h4 class="productType">新品</h4>
                        <img src="${product.images}">
                        <a href="#" class="addCartBtn" data-addid="${product.id}">加入購物車</a>
                        <h3>${product.title}</h3>
                        <del class="originPrice">NT$${product.origin_price}</del>
                        <p class="nowPrice">NT$${product.price}</p>
                      </li>
                    `;
    });
    document.querySelector('.productWrap').innerHTML = productDOM;
    products.forEach((product, index) => {
      document.querySelectorAll('.addCartBtn')[index].addEventListener('click', (e) => {
        e.preventDefault();
        addCart(e);
      });
    });
  };

  const getCartList = () => {
    const url = `${baseURL}/customer/${api_path}/carts`;
    axios.get(url).then((response) => {
      console.log(response.data.carts);
      rendorCarts(response.data.carts);
    });
  };

  const rendorCarts = (carts) => {
    let cartDOM = `<tr>
                    <th width="40%">品項</th>
                    <th width="15%">單價</th>
                    <th width="15%">數量</th>
                    <th width="15%">金額</th>
                    <th width="15%"></th>
                  </tr>`;
    let totalPrice = 0;
    if (carts.length > 0) {
      carts.forEach((cart) => {
        cartDOM += `
                    <tr>
                      <td>
                        <div class="cardItem-title">
                          <img src="https://i.imgur.com/HvT3zlU.png" alt="">
                          <p>${cart.product.title}</p>
                        </div>
                      </td>
                      <td>NT$${cart.product.price}</td>
                      <td>${cart.quantity}</td>
                      <td>NT$${cart.product.price * cart.quantity}</td>
                      <td class="discardBtn">
                        <a href="#" class="deleteBtn material-icons" data-delid="${cart.id}">
                          clear
                        </a>
                      </td>
                    </tr>
                  `;
        totalPrice += cart.product.price * cart.quantity;
      });
    } else {
      cartDOM += `<tr>
                    <td>
                      <div class="cardItem-title">
                        <p>購物車內沒有商品</p>
                      </div>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>`;
    }
    cartDOM += `<tr>
                  <td>
                    <a href="#" class="discardAllBtn">刪除所有品項</a>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <p>總金額</p>
                  </td>
                  <td>NT$${totalPrice}</td>
                </tr>`;
    document.querySelector('.shoppingCart-table').innerHTML = cartDOM;
    carts.forEach((cart, index) => {
      document.querySelectorAll('.deleteBtn')[index].addEventListener('click', (e) => {
        e.preventDefault();
        deleteCart(e.target.dataset.delid);
      });
    });
    document.querySelector('.discardAllBtn').addEventListener('click', (e) => {
      e.preventDefault();
      clearCart();
    });
  };

  const addCart = (e) => {
    e.preventDefault();
    const url = `${baseURL}/customer/${api_path}/carts`;
    let cart = {};
    const product = { data: {} };
    axios.get(url).then((response) => {
      cart = response.data.carts.find(cart => cart.product.id === e.target.dataset.addid);
      console.log(response.data.carts);
      if (cart != undefined) {
        product.data.productId = cart.product.id;
        product.data.quantity = cart.quantity + 1;
        console.log('add one');
      } else {
        product.data.productId = e.target.dataset.addid;
        product.data.quantity = 1;
        console.log('new item');
      }
      console.log(product);
      axios.post(url, product).then((response) => {
        console.log(response);
        getCartList();
      });
    });
    console.log(e.target.dataset.addid);
  };

  const deleteCart = (delid) => {
    const url = `${baseURL}/customer/${api_path}/carts`;
    axios.delete(`${url}/${delid}`).then((response) => {
      console.log(response);
      getCartList();
    });
  };

  const clearCart = () => {
    const url = `${baseURL}/customer/${api_path}/carts`;
    axios.delete(url).then((response) => {
      console.log(response);
      getCartList();
    });
  };

  getProductList();
  getCartList();
})