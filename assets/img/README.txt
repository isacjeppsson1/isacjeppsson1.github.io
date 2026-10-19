Lägg era bröllopsfoton i denna mapp (t.ex. photo-1.jpg, photo-2.jpg).

Därefter, i index.html, ersätt varje platshållande galleriruta
(.gallery__tile--ph) med ett rikt foto så här:

  <figure class="gallery__tile reveal" data-full="assets/img/photo-1.jpg">
    <img src="assets/img/photo-1.jpg" alt="Elin och Isac" loading="lazy" />
  </figure>

Tips: håll bilderna i rimlig storlek (under ~500 KB vardera) så att sajten förblir snabb.
