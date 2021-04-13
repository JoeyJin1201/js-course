document.addEventListener('DOMContentLoaded', () => {
  const baseURL = 'https://hexschoollivejs.herokuapp.com/api/livejs/v1';
  const api_path = 'joey1201';

  // C3.js
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: "pie",
      columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
      ],
      colors: {
        "Louvre 雙人床架": "#DACBFF",
        "Antony 雙人床架": "#9D7FEA",
        "Anty 雙人床架": "#5434A7",
        "其他": "#301E5F",
      }
    },
  });

  const getOrderList = () => {
    const url = `${baseURL}/admin/${api_path}/orders`;
    axios.get(url, { headers: { authorization: 'xFxdGZoxDQXt8X5AhnsBKzQTZG42' } }).then((response) => {
      console.log(response);
      renderOrders(response.data.orders);
    });
  };

  const renderOrders = (orders) => {
    console.log(orders);
    let orderDOM = `<thead>
                      <tr>
                        <th>訂單編號</th>
                        <th>聯絡人</th>
                        <th>聯絡地址</th>
                        <th>電子郵件</th>
                        <th>訂單品項</th>
                        <th>訂單日期</th>
                        <th>訂單狀態</th>
                        <th>操作</th>
                      </tr>
                    </thead>`;
    orders.forEach((order) => {
      orderDOM += `
                    <tr>
                      <td>${order.id}</td>
                      <td>
                        <p>${order.user.name}</p>
                        <p>${order.user.tel}</p>
                      </td>
                      <td>${order.user.address}</td>
                      <td>${order.user.email}</td>
                      <td>
                        <p>${order.products[0].title}</p>
                      </td>
                      <td>${new Date(Number(order.createdAt + '000'))}</td>
                      <td class="orderStatus">
                        <a href="#">未處理</a>
                      </td>
                      <td>
                        <input type="button" class="delSingleOrder-Btn" value="刪除">
                      </td>
                    </tr>
                  `;
    });
    document.querySelector('.orderPage-table').innerHTML = orderDOM;
  };

  getOrderList();
});