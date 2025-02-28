export default function renderModalId(state, i18nextInstance, elements) {
    const { modalTitle, modalBody, viewButton } = elements;
    const post = state.posts.find((p) => p.id === state.modalPostId);
    if (post) {
      modalTitle.textContent = i18nextInstance.t(post.title);
      modalBody.textContent = i18nextInstance.t(post.description);
      viewButton.onclick = () => {
        const link = document.createElement('a');
        link.href = post.link;
        link.target = '_blank';
        link.click();
      };
    }
  }
  