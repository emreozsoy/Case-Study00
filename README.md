<h1 align="center">🛍️ ETERNATE | Dinamik Fiyatlı Ürün Listeleme Uygulaması (Full-Stack Case Study)</h1>

<p align="center">
  Gerçek zamanlı <strong>finansal verileri (Gram Altın fiyatı)</strong> kullanarak ürün fiyatlarını <strong>dinamik</strong> olarak hesaplayan ve <strong>modern, duyarlı (responsive)</strong> bir arayüzde listeleyen bir uygulamadır.
</p>

<hr>

<h2>🔗 Canlı Uygulama Linkleri</h2>

<table>
  <thead>
    <tr>
      <th>Bileşen</th>
      <th>Platform</th>
      <th>Canlı URL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend (Web Sitesi)</strong></td>
      <td>Vercel / Netlify</td>
      <td><a href="#">https://case-study00.vercel.app/</a></td>
    </tr>
    <tr>
      <td><strong>Backend (API Sunucusu)</strong></td>
      <td>Render</td>
      <td><a href="https://case-study00.onrender.com/api/products" target="_blank">https://case-study00.onrender.com/api/products</a></td>
    </tr>
    <tr>
      <td><strong>GitHub Deposu</strong></td>
      <td>GitHub</td>
      <td><a href="https://github.com/emreozsoy/Case-Study00" target="_blank">https://github.com/emreozsoy/Case-Study00</a></td>
    </tr>
  </tbody>
</table>

<hr>

<h2>📸 Uygulama Görünümü (Mockup)</h2>

<p>Uygulamanın genel görünümü ve mobil uyumluluğu aşağıdaki gibidir:</p>
<img width="1919" height="1038" alt="image" src="https://github.com/user-attachments/assets/eadc7ccb-f43a-4258-9a12-1e5577806c54" />

<ul>
  <li>📱 <strong>Mobil Görünüm (Responsive Testi):</strong><br>
    
    <em><img width="246" height="494" alt="image" src="https://github.com/user-attachments/assets/91c6b28e-2efa-4418-ad9a-a5b36089e762" />
</em>
  </li>
</ul>

<hr>
<h2>🛠️ Teknik Yığın (Tech Stack)</h2>

<h3>Frontend</h3>
<ul>
  <li><strong>HTML5 & CSS3:</strong> Temel yapı ve stillendirme.</li>
  <li><strong>Vanilla JavaScript:</strong> Dinamik DOM manipülasyonu, karusel ve renk seçici işlevselliği.</li>
  <li><strong>Tipografi (TFF):</strong> Yerel <em>Montserrat</em> ve <em>Avenir</em> fontları <code>@font-face</code> ile entegre edilmiştir.</li>
</ul>

<h3>Backend & API</h3>
<ul>
  <li><strong>Node.js & Express:</strong> Hafif, kararlı ve ölçeklenebilir RESTful API.</li>
  <li><strong>Dosya Yönetimi:</strong> Ürün verileri <code>products.json</code> dosyasından okunur.</li>
</ul>

<hr>

<h3>🧠 1. Fiyat Kararlılığı için Önbellekleme (Caching)</h3>
<p>
  <strong>Sorun:</strong> Finans API’lerinden gelen saniyelik fiyat değişimleri, e-ticaret sitelerinde güvenilirlik sorununa neden olabilir.<br>
  <strong>Çözüm:</strong> Backend tarafında GoldAPI.io’dan alınan fiyat 15 dakikalığına bellekte (cache) saklanır. Bu süre dolmadan fiyat sabit kalır.
</p>


<h3>💰 3. Dinamik Fiyat Hesaplama</h3>
<p>Fiyatlar, görevde belirtilen formüle göre <strong>Backend</strong> tarafında hesaplanır:</p>

<pre><code>Price = (PopularityScore + 1) × Weight × GoldPrice
</code></pre>

<p><strong>Popülerlik Skoru:</strong> Yüzdelik değer, 5 üzerinden 1 ondalık hassasiyetle normalize edilir (<code>product.popularityScoreOutOf5</code>).</p>

<h3>🔄 4. Tek Yönlü Veri Akışı</h3>
<p>
  Frontend yalnızca <strong>Backend’den gelen hesaplanmış veriyi</strong> alır.<br>
  Tüm iş mantığı <strong>sunucu tarafında</strong> çalışır, böylece veri tutarlılığı korunur.
</p>

<hr>



<h3>2️⃣ Frontend’i Görüntüleme</h3>
<p>
  Backend çalışır durumdayken:
  <ul>
    <li><code>frontend/index.html</code> dosyasına çift tıklayarak tarayıcıda açabilirsiniz.</li>
    <li>Alternatif olarak, canlı Vercel/Netlify bağlantısından erişebilirsiniz.</li>
  </ul>
</p>

<hr>

