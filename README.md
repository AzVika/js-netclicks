# Ворк-шоп Netclicks 
##по применению javascript от Glo Academy

Реализация поиска фильмов и получение допольнительной информации в модальном окне.

Проект сверстан не мной и выдан для обучение программированию на javascript.

Практически все изменения касаются только файла main.js, который был создан в процессе обучения с нуля.

## 1 день
Реализовано открытие и закрытие меню при нажатии на гамбургер слева вверху.
А так же открытие и закрытия подменю по нажатию на пункты меню.

## 2 день
Реализовано открытие и закрытие модального окна.
При наведении мышки на картинку карточки с фильмом происходит смена картинки, адрес которой хранится в атрибуте data-, и наоборот.
Запрос через fetch к файлу test.json, получение объекта и формирование карточки с фильмом, исходя из полученных данных. Выведение карточек с фильмами на страницу.
Создание  API ключа на сайте https://www.themoviedb.org/settings/api

## 3 день
При вводе в поиске запроса, получаем данные с https://www.themoviedb.org через fetch и выводим карточки с фильмами.
При клике по любому сериалу получаем данные по нему и выводим в модальном окне.
Если данные не пришли, то выводится, что ничего не найдено.
Если у фильма нет картинки, то в модальном окне она не выводится.
Добавлен прелойдер при ожидании данных поиска по названию.

## 4 день
В меню при нажатии на пункты меню Рейтинг ("Топ сериалов" или "Популярные") или "Новые эпизоды" ("Сегодня" или "На неделю"), получаем данные с https://www.themoviedb.org через fetch соответсвующего типа и выводим карточки с фильмами.
При нажатии в меню "Поиск" очищается список карточек, курсор переводится в строчку поиска.
Реализована пагинация.

## Дополнительные улучшения
Закрытие левого меню при нажатии на пункты Меню.
Исправлены ошибки в пагинации, установлено ограничение в 20 страниц. Активный пункт имеет другую стилистику.
Часть кода после обработчиков событий перенесено в отдельные функции.
Добавлена информация о фильмах в модальном окне - год выпуска.
Добавлены трейлеры к конкретному фильму в модальном окне. Данные получаются через fetch отдельно.


### Полезные ссылки
Ссылка на реализованный проект - https://prostovix.info/xxx/js-netclicks/

Ссылка на ключи от themoviedb https://www.themoviedb.org/settings/api

ССылка на документацию TV при работе с IP https://developers.themoviedb.org/3/tv/get-tv-details 
