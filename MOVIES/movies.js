const main = document.querySelector('main');
const form = document.querySelector('form');
const search = document.querySelector('#search')
const clear = document.querySelector('.clear');

const baseurl = 'https://api.themoviedb.org/3/';
const discoverurl = 'discover/movie?';
const searchurl = 'search/movie?';
const tags = document.querySelector('#tags');
const pre = document.querySelector('.pre');
const next = document.querySelector('.next');
const page = document.querySelector('.current');
let sortby = 'popularity.desc';
let lasturl;
let selectgenres = [];
let cur = 1;
let totalpages;
const sc = [document.querySelector('#popular'), document.querySelector('#Rating'), document.querySelector('#upcoming'), document.querySelector('#revenue')]
sc[0].classList.add('selectedtag')

const getmovie = async (type) => {
    try {
        lasturl = type;
        const config = { params: { sort_by: sortby, api_key: '7b4fdab06810dcb18c525475eae2415f', with_genres: selectgenres.join(), page: cur } }
        const res = await axios.get(baseurl + type, config)
        totalpages = res.data.total_pages
        addmovie(res.data.results)
    } catch (e) {
        console.log("ERROR!", e);
    }
}
getmovie(discoverurl);

function addmovie(movies) {
    main.innerHTML = ''
    page.innerText = cur;
    if (movies.length == 0) {
        main.innerHTML = "<h1>No Results Found </h1>"
        return;
    }
    for (const movie of movies) {
        const d = document.createElement('div');
        d.classList.add('movie');
        let s = "red";
        if (movie.vote_average >= 8) {
            s = "green";
        }
        else if (movie.vote_average >= 6.5) {
            s = "orange";
        }
        d.innerHTML = `<img
        src="${movie.backdrop_path ? `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}` :
                "https://www.kindpng.com/picc/m/18-189751_movie-placeholder-hd-png-download.png"}"
        alt="${movie.title}">
    <div class="info">
        <h3>${movie.title}</h3>
        <div class="rating ${s}">${movie.vote_average}</div>
    </div>
    <div class="desc">
        <h3>Description</h3>
        ${movie.overview}
        <br>
        <div class="movbuttons">
        <button type="button" class="btn btn-danger btn-lg know-more" id="${movie.id}1">Know more</button>
        <button type="button" class="btn btn-danger btn-lg know-more" id="${movie.id}2">Similar Movies</button>
        </div>
        </div>
    </div>`

        main.append(d);
        document.getElementById(movie.id + '1').addEventListener('click', () => {
            // console.log(movie.id);
            openNav(movie, 0);
        }
        )
        document.getElementById(movie.id + '2').addEventListener('click', () => {
            // console.log(movie.id);
            openNav(movie, 1);
        }
        )
    }
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    tagclear();
    popular()
    pre.classList.add('disable')
    if (search.value) {
        getmovie(searchurl + `query=${search.value}&`)
    }
    else {
        getmovie(discoverurl);
    }
})
async function gettags() {
    try {
        const allgs = await axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=7b4fdab06810dcb18c525475eae2415f');
        const g = allgs.data.genres;
        for (let genre of g) {
            const newdiv = document.createElement('div');
            newdiv.innerText = genre.name;
            newdiv.id = genre.id;
            newdiv.classList.add('tag');
            tags.append(newdiv);
            newdiv.addEventListener('click', () => {
                search.value = ''
                let b = 1;
                let i = 0;
                for (let g of selectgenres) {
                    if (g == newdiv.id) {
                        b = 0;
                        break;
                    }
                    ++i;
                }
                if (b) {
                    selectgenres.push(newdiv.id);
                    newdiv.classList.add('selectedtag');

                }
                else {
                    newdiv.classList.remove('selectedtag');
                    selectgenres.splice(i, 1);
                }
                getmovie(discoverurl);
            })
        }
    }
    catch {
        console.log('error tags');
    }
}
gettags();

const tagclear = () => {
    clear.class
    const alltags = document.querySelectorAll('.tag')
    for (let t of alltags) {
        for (let s of selectgenres) {
            if (t.id == s) {
                t.classList.remove('selectedtag')
            }
        }
    }
    selectgenres = [];
    cur = 1;
}
function sortclear() {
    for (let s of sc) {
        if (s.accessKey == sortby) {
            s.classList.remove('selectedtag')
            break
        }
    }
}

clear.addEventListener('click', () => {
    tagclear();
    search.value = '';
    getmovie(discoverurl);
})

pre.addEventListener('click', () => {
    if (cur != 1) {
        --cur;
        getmovie(lasturl);
        search.scrollIntoView({ behavior: "smooth" });
    }
    if(cur==1)
    {
        pre.classList.add('disable')
    }
})

next.addEventListener('click', () => {
    if (cur != totalpages) {
        ++cur;
        getmovie(lasturl);
        search.scrollIntoView({ behavior: "smooth" });
        pre.classList.remove('disable')
    }
})

async function openNav(movie, b) {
    let overlaycontent = document.querySelector('.overlay-content');
    let videostring = '';
    let cind = '';
    let carouselindicators = document.querySelector('.carousel-indicators');
    let carouselinner = document.querySelector('.carousel-inner');
    let i = 0;
    if (b == 0) {
        let v = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=7b4fdab06810dcb18c525475eae2415f`);
        let videos = v.data.results;
        for (let video of videos) {
            if (video.site == "YouTube") {
                if (i == 0) {
                    cind += `<li data-target="#myCarousel" data-slide-to="${i}" class="active"></li>`;
                    videostring += (`
                <iframe class="item active" width="560" height="315" src="https://www.youtube.com/embed/${video.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  
                `);
                }
                else {
                    cind += `<li data-target="#myCarousel" data-slide-to="${i}" "></li>`;
                    videostring += (`
            <iframe class="item" width="560" height="315" src="https://www.youtube.com/embed/${video.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  
            `);
                }
                ++i;
            }
        }
    }
    else {
        //https://api.themoviedb.org/3/movie/{movie_id}/similar?api_key=7b4fdab06810dcb18c525475eae2415f&language=en-US&page=1
        const config = { params: { api_key: '7b4fdab06810dcb18c525475eae2415f' } }
        let v = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/similar?`, config)
        let similar = v.data.results
        for (let mov of similar) {
            let s = "red";
            if (mov.vote_average >= 8) {
                s = "green";
            }
            else if (mov.vote_average >= 6.5) {
                s = "orange";
            }
            if (i == 0) {
                cind += `<li data-target="#myCarousel" data-slide-to="${i}" class="active"></li>`;
                videostring += (`
                <div class="item active">
            <img
    src="${mov.backdrop_path ? `https://image.tmdb.org/t/p/w500/${mov.backdrop_path}` :
                        "https://www.kindpng.com/picc/m/18-189751_movie-placeholder-hd-png-download.png"}"
    alt="${mov.original_title}">
<div class="info">
    <h3>${mov.original_title}</h3>
    <div class="rating ${s}">${mov.vote_average}</div>
</div></div>
    `);
            }
            else {
                cind += `<li data-target="#myCarousel" data-slide-to="${i}" "></li>`;
                videostring += (`
            <div class="item">
        <img
src="${mov.backdrop_path ? `https://image.tmdb.org/t/p/w500/${mov.backdrop_path}` :
                        "https://www.kindpng.com/picc/m/18-189751_movie-placeholder-hd-png-download.png"}"
alt="${mov.original_title}">
<div class="info">
<h3>${mov.original_title}</h3>
<div class="rating ${s}">${mov.vote_average}</div>
</div></div>
`);
            }
            ++i;
        }
    }
    if (videostring === '') {
        videostring = '<h1>No Results Found </h1>'
        carouselinner.innerHTML = videostring
        carouselindicators.innerHTML = '';
        document.getElementById("myNav").style.width = "100%"
        return;
    }
    carouselindicators.innerHTML = cind;
    carouselinner.innerHTML = videostring
    document.getElementById("myNav").style.width = "100%"
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}
function popular() {
    sortclear();
    document.querySelector('#popular').classList.add('selectedtag');
    sortby = 'popularity.desc';
    getmovie(discoverurl)

}
document.querySelector('#popular').addEventListener('click', () => {
    popular()
    search.value = ''
})
document.querySelector('#Rating').addEventListener('click', () => {
    sortclear();
    search.value = ''
    //?api_key=7b4fdab06810dcb18c525475eae2415f&language=en-US&page=1
    document.querySelector('#Rating').classList.add('selectedtag');
    sortby = 'vote_count.desc';
    getmovie(discoverurl)
})
document.querySelector('#upcoming').addEventListener('click', () => {
    sortclear();
    search.value = ''
    document.querySelector('#upcoming').classList.add('selectedtag');
    sortby = 'primary_release_date.desc';
    getmovie(discoverurl)
})
document.querySelector('#revenue').addEventListener('click', () => {
    sortclear();
    search.value = ''
    document.querySelector('#revenue').classList.add('selectedtag');
    sortby = 'revenue.desc';
    console.log(sortby)
    getmovie(discoverurl)
})



