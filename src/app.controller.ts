import { Controller, Delete, Get, Param, Query, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { quotes } from './quotes';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('quotespage')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('quotes')
  @Render('quotespage')
  getQuotes() {
    return {
      quotes: quotes.quotes,
    }
  }

  @Get('random')
  @Render('randomquote')
  getRandomQuote() {
    let random = Math.floor(Math.random() * quotes.quotes.length);
    return {
      quote: quotes.quotes[random],
    }
  }

  @Get("top")
  @Render("topauthors")
  getTopAuthors() {
    const authors = quotes.quotes.map(quote => quote.author);
    const dict: { [key: string]: number } = {};
    authors.forEach(author => {
      if (dict[author]) {
        dict[author] += 1;
      } else {
        dict[author] = 1;
      }
    });

    const sortedAuthorDict = Object.entries(dict)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    return {
      authorDict: sortedAuthorDict
    };
  }


  @Get('quotes/:id')
  @Render('onequotetorulethemall')
  oneQuote(@Param('id') id: string) {
    console.log(quotes.quotes[id]);
    return {
      quote: quotes.quotes[id]
    }
  }

  @Get('delete/:id')
  @Render('deleted')
  deleteSingleQuote(@Param('id') id: string) {
    const itemIndex = quotes.quotes.findIndex((quote) => quote.id === parseInt(id));
    if (itemIndex === -1) {
      return {
        delete: false,
        text: `Quote with id ${id} not found.`
      };
    }

    const deletedQuote = quotes.quotes.splice(itemIndex, 1)[0];

    return {
      delete: true,
      text: `Quote "${deletedQuote.quote}" has been successfully deleted.`
    };
  }

  @Get('search')
  @Render('searchquote')
  searchQuote(@Query('input') input: string = '') {
    const searchResult = quotes.quotes.filter((quote) => quote.quote.toLowerCase().includes(input.toLowerCase()));
    return {
      searchResult: searchResult
    }
  }

  @Get('authorForm')
  @Render('authorRandomForm')
  authorForm(@Query('author') author: string = '') {
    return {
      url: `/authorRandom?author=${author}`
    };
  }

  @Get('authorRandom')
  @Render('authorRandom') 
  authorRandom(@Query('author') author: string = '') {
    const authorQuotes = quotes.quotes.filter((quote) =>
      quote.author.toLowerCase().includes(author.toLowerCase())
    );
    if (authorQuotes.length === 0) {
      return {
        result: `No quotes found by author ${author}.`
      };
    } else {
      console.log(authorQuotes[Math.floor(Math.random() * authorQuotes.length)])
      return {
        result: authorQuotes[Math.floor(Math.random() * authorQuotes.length)]
      };
    }
  }

  @Get('referenceform')
  @Render('referenceform')
  referenceForm(@Query('ref') ref: string = '') {
    return {
      url: `/displayref?ref=${ref}`
    }
  }

  @Get('displayref')
  @Render('displayref')
  Findref(@Query('ref') ref: string = '') {
    const refQuotes = quotes.quotes.filter((quote) =>
      quote.quote.toLowerCase().includes(ref.toLowerCase())
    );
    return {
      refQuotes: refQuotes
    }

  }

}
