{
  ('use strict');

  const templates = {
    articleLink: Handlebars.compile(
      document.querySelector('#template-article-link').innerHTML
    ),
    tagLink: Handlebars.compile(
      document.querySelector('#template-tag-link').innerHTML
    ),
    authorLink: Handlebars.compile(
      document.querySelector('#template-author-link').innerHTML
    ),
    tagCloudLink: Handlebars.compile(
      document.querySelector('#template-tag-cloud-link').innerHTML
    ),
    authorListLink: Handlebars.compile(
      document.querySelector('#template-author-list-link').innerHTML
    ),
  };

  const opts = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post-author',
    tagsListSelector: '.tags',
    authorsListSelector: '.authors',
    cloudClassCount: '6',
    cloudClassPrefix: 'tag-size-',
  };

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;
    console.log('Links was clicked');

    /* [DONE] remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */

    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */

    const activeArticles = document.querySelectorAll('.post');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */

    const articleSelector = clickedElement.getAttribute('href');
    console.log(articleSelector);

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */

    const targetArticle = document.querySelector(articleSelector);
    console.log('właściwy artykuł: ', targetArticle);

    /* [DONE] add class 'active' to the correct article */

    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelecor = '') {
    console.log('Title links were generated!');

    /* remove contents of titleList */

    const titleList = document.querySelector(opts.titleListSelector);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */

    const articles = document.querySelectorAll(
      opts.articleSelector + customSelecor
    );

    let html = '';

    for (let article of articles) {
      /* get the article id */

      const articleId = article.getAttribute('id');

      /* find the title element */

      const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
      console.log(articleTitle);

      /* create HTML of the link */
      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);

      // console.log(linkHTML);

      /* insert link into titleList */

      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    console.log(links);

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  }

  generateTitleLinks();

  function calculateTagsParams(tags) {
    const params = { max: 0, min: 999999 };
    for (let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + ' times');
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }

    return params;
  }

  function calculateTagClass(count, params) {
    classNumber = Math.floor(
      ((count - params.min) / (params.max - params.min)) *
        opts.cloudClassCount +
        1
    );
    return opts.cloudClassPrefix + classNumber;
  }

  function generateTags() {
    /* create a new variable allTags with an empty object */

    let allTags = {};
    console.log(allTags);

    /* find all articles */

    const articles = document.querySelectorAll(opts.articleSelector);

    /* START LOOP: for every article: */

    for (let article of articles) {
      let html = '';

      /* find tags wrapper */

      const tagsWrapper = article.querySelector(opts.articleTagsSelector);

      // console.log(tagsWrapper);

      /* make html variable with empty string */

      tagsWrapper.innerHTML = '';

      /* get tags from data-tags attribute */

      let articleTags = article.getAttribute('data-tags');
      // console.log(articleTags);

      /* split tags into array */

      const articleTagsArray = articleTags.split(' ');
      // console.log(articleTagsArray);

      /* START LOOP: for each tag */

      for (let tag of articleTagsArray) {
        // console.log(tag);

        /* generate HTML of the link */

        // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + "</a></li>";
        const linkHTMLData = { id: tag, title: tag };
        const linkHTML = templates.tagLink(linkHTMLData);
        // console.log(linkHTML);

        tagsWrapper.insertAdjacentHTML('beforeend', linkHTML);

        /* add generated code to html variable */

        html = html + linkHTML;
        // console.log(html);

        /* check if this link is NOT already in allTags */

        if (!allTags[tag]) {
          /* add tag to allTags object */

          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

        /* END LOOP: for each tag */
      }

      /* insert HTML of all the links into the tags wrapper */

      tagsWrapper.innerHTML = html;
    }

    /* END LOOP: for every article: */

    /* find list of tags in right column */

    const tagList = document.querySelector(opts.tagsListSelector);

    // console.log(tagList);

    const tagsParams = calculateTagsParams(allTags);
    console.log('tagsParams:', tagsParams);

    /* create variable for all links HTML code */

    const allTagsData = { tags: [] };

    /* START LOOP: for each tag in allTags: */

    for (let tag in allTags) {
      /* generate code of a link and add it to allTagsHTML */
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });
    }
    // console.log(allTags);

    /* END LOOP: for each tag in allTags: */

    /* add HTML from allTagsHTML to tagList */

    tagList.innerHTML = templates.tagCloudLink(allTagsData);
    console.log(allTagsData);
  }

  generateTags();

  function tagClickHandler(event) {
    /* prevent default action for this event */

    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */

    const clickedElement = this;
    console.log(clickedElement);

    /* make a new constant "href" and read the attribute "href" of the clicked element */

    const href = clickedElement.getAttribute('href');
    console.log(href);

    /* make a new constant "tag" and extract tag from the "href" constant */

    const tag = href.replace('#tag-', '');
    console.log(tag);

    /* find all tag links with class active */

    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    console.log(tagLinks);

    /* START LOOP: for each active tag link */

    for (tag of tagLinks) {
      /* remove class active */
      tag.classList.remove('active');
    }

    /* END LOOP: for each active tag link */

    /* find all tag links with "href" attribute equal to the "href" constant */

    const tagLinksSameValue = document.querySelectorAll(
      'a[href="' + href + '"]'
    );
    console.log(tagLinksSameValue);

    /* START LOOP: for each found tag link */

    for (tag of tagLinks) {
      /* add class active */
      tag.classList.add('active');
    }

    /* END LOOP: for each found tag link */

    /* execute function "generateTitleLinks" with article selector as argument */

    generateTitleLinks('[data-tags~="' + tag + '"]');
  }
  function addClickListenersToTags() {
    /* find all links to tags */
    const tags = document.querySelectorAll('.post-tags a, .list.tags a');

    /* START LOOP: for each link */

    for (let tag of tags) {
      /* add tagClickHandler as event listener for that link */
      tag.addEventListener('click', tagClickHandler);
    }

    /* END LOOP: for each link */
  }

  addClickListenersToTags();

  function generateAuthors() {
    /* create a new variable allAuthors with an empty object */
    let allAuthors = {};
    // console.log(allAuthors);

    /* find all articles */
    const articles = document.querySelectorAll(opts.articleSelector);
    // console.log(articles);

    /* START LOOP: for every article: */

    for (let article of articles) {
      let html = '';

      /* find authors wrapper */

      const authorsWrapper = article.querySelector(opts.articleAuthorSelector);

      /* make html variable with empty string */

      authorsWrapper.innerHTML = '';
      // console.log(authorsWrapper);

      /* get authors from data-authors attribute */

      let articleAuthor = article.getAttribute('data-author');
      // console.log(articleAuthor);

      /* generate HTML of the author */

      const linkHTMLData = { id: articleAuthor, title: articleAuthor };
      const linkHTML = templates.authorLink(linkHTMLData);
      // console.log(linkHTML);

      authorsWrapper.insertAdjacentHTML('beforeend', linkHTML);

      /* add generated code to html variable */

      html = html + linkHTML;

      /* check if this link is NOT already in allAuthors */
      if (!allAuthors[articleAuthor]) {
        /* add tag to allAuthors object */
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      /* insert HTML of all the links into the authors wrapper */

      authorsWrapper.innerHTML = html;
    }

    /* END LOOP: for every article */

    /* find list of authors in right column */
    const authorList = document.querySelector(opts.authorsListSelector);
    // console.log(authorList);

    /* create variable for all links HTML code */
    const allAuthorsData = { authors: [] };

    /* START LOOP: for each author in allAuthors: */

    for (let author in allAuthors) {
      /* generate code of a link and add it to allAuthorsHTML */
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
      });
    }

    /* END LOOP: for each author in allAuthors: */

    // console.log(allAuthors);

    /* add HTML from allAuthorsHTML to authorList */
    authorList.innerHTML = templates.authorListLink(allAuthorsData);
    console.log(allAuthorsData);
  }
  generateAuthors();

  function authorClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */

    const clickedElement = this;
    // console.log(clickedElement);

    /* make a new constant "href" and read the attribute "href" of the clicked element */

    const href = clickedElement.getAttribute('href');
    // console.log(href);

    /* make a new constant "author" and extract tag from the "href" constant */

    const author = href.replace('#author-', '');
    // console.log(author);

    /* find all author links with class active */

    const authorsLinks = document.querySelectorAll(
      'a.active[href^="#author-"]'
    );
    // console.log(authorsLinks);

    /* START LOOP: for each active author link */

    for (author of authorsLinks) {
      /* remove class active */
      author.classList.remove('active');
    }

    /* END LOOP: for each active author link */

    /* find all author links with "href" attribute equal to the "href" constant */

    const authorsLinksSameValue = document.querySelectorAll(
      'a[href="' + href + '"]'
    );
    // console.log(authorsLinksSameValue);

    /* START LOOP: for each found author link */

    for (author of authorsLinks) {
      /* add class active */
      author.classList.add('active');
    }

    /* END LOOP: for each found author link */

    /* execute function "generateTitleLinks" with article selector as argument */

    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors() {
    /* find all links to authors */
    const authors = document.querySelectorAll(
      '.post-author a, .list.authors a'
    );
    // console.log(authors);

    /* START LOOP: for each link */

    for (let author of authors) {
      /* add authorClickHandler as event listener for that link */
      author.addEventListener('click', authorClickHandler);
    }

    /* END LOOP: for each link */
  }
  addClickListenersToAuthors();
}
