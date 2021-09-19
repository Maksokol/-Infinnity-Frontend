const gitHubForm = document.getElementById('gitHubForm');
//Загрузка контекста
document.getElementById('usernameInput').value = JSON.parse(localStorage.getItem("GitUser"));
requestUserRepos(document.getElementById('usernameInput').value);
gitHubForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let usernameInput = document.getElementById('usernameInput');
    let gitHubUsername = usernameInput.value;
    localStorage.setItem("GitUser",JSON.stringify(gitHubUsername));
    requestUserRepos(gitHubUsername);
})

function requestUserData(username) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.github.com/users/${username}`;
    xhr.open('GET', url, true);
    xhr.onload = function() {
	    const data = JSON.parse(this.response);
		let avatar = document.createElement('div');
		let bio = document.getElementById('bio');
		avatar.innerHTML = (`<img src="https://avatars.githubusercontent.com/u/${data.id}?v=4" width="100" height="100">`);
		bio.appendChild(avatar);
		let info = document.createElement('div');
		info.classList.add('centered');
		info.innerHTML = (`<p style="margin: 0;">${(data.bio == null) ? "" : data.bio}</p>
			${(data.email == null) ? "" : "<a href=\"mailto:data.email\">"+data.email}</a>`);
		bio.appendChild(info);
		let mail = document.createElement('div');
	}
    xhr.send();
}

function requestUserRepos(username) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.github.com/users/${username}/repos`;
    xhr.open('GET', url, true); //отправить get запрос
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        let root = document.getElementById('userRepos');
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
    	let bio = document.getElementById('bio');
	    while (bio.firstChild) {
	        bio.removeChild(bio.firstChild);
		}
        if (data.message === "Not Found") {
            let ul = document.getElementById('userRepos');
            let li = document.createElement('li');
            li.innerHTML = (`
                <p><strong>Нет аккаунта с таким логином:</strong> ${username}</p>`);
            ul.appendChild(li);
        } else {
			requestUserData(username);
            let ul = document.getElementById('userRepos');
            let p = document.createElement('div');
            p.classList.add(`w100`);
            p.innerHTML = (`<p ><strong>Репозиториев:${data.length}</p>`)
            ul.appendChild(p);
            for (let i in data) {
                let li = document.createElement('li');
           		li.classList.add('pad');
                let upDate = new Date(data[i].updated_at);
                li.innerHTML = (`
                <h2> <a href="${data[i].html_url}">${data[i].name}</a></h2>
                <p><strong>Описание:</strong> ${(data[i].description == null) ? "" : data[i].description}</p>
                <p><strong>Обновлен:</strong> ${upDate.toLocaleString()}</p>
            `);
                ul.appendChild(li);
            }
        }
    }
    xhr.send();

}