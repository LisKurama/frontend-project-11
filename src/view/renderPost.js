/* eslint-disable no-param-reassign */
export default function renderPosts(state, i18nextInstance, elements) {
    const { postList } = elements;
    postList.innerHTML = '';
  
    if (state.posts.length > 0) {
      const postTitle = document.createElement('h2');
      postTitle.textContent = i18nextInstance.t('Posts');
      postList.appendChild(postTitle);
  
      const ulPost = document.createElement('ul');
      state.posts.forEach((post) => {
        const liPost = document.createElement('li');
        liPost.setAttribute('data-id', post.id);
        liPost.classList.add('liPost');
  
        const postLink = document.createElement('a');
        postLink.setAttribute('href', post.link);
        postLink.setAttribute('target', '_blank');
        postLink.textContent = i18nextInstance.t(post.title);
  
        if (state.readPosts.includes(post.id)) {
          postLink.classList.remove('fw-bold');
          postLink.classList.add('fw-normal', 'text-muted');
        } else {
          postLink.classList.add('fw-bold');
          postLink.classList.remove('fw-normal', 'text-muted');
        }
  
        const button = document.createElement('button');
        button.classList.add('buttonPost');
        button.setAttribute('type', 'button');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#exampleModal');
        button.textContent = i18nextInstance.t('view');
  
        liPost.appendChild(postLink);
        liPost.appendChild(button);
        ulPost.appendChild(liPost);
      });
  
      postList.appendChild(ulPost);
    }
  }
  