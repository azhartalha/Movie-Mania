import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Link} from "react-router-dom";

class MovieSearchComp extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {pg_no: 1, data:[], data_loaded: false};     
    }
    
    componentDidUpdate(prevProps)
    {
        if(prevProps.value!=this.props.value)
        {
            fetch("http://127.0.0.1:8000/MM_apis/movie_search?page=1&name=" +this.props.value, {
           method: "get", 
            })
            .then( res => {
                res.json()
            .then(response =>{
                this.setState({data: response, data_loaded: true, pg_no: 1});
            })
            })    
        }
    }

    componentDidMount()
    {
        fetch("http://127.0.0.1:8000/MM_apis/movie_search?page=" + this.state.pg_no+ "&name=" +this.props.value, {
           method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            this.setState({data: response, data_loaded: true});
        })
        })
    }

    nextPage()
    {
        fetch("http://127.0.0.1:8000/MM_apis/movie_search?page=" + this.state.pg_no+1+ "&name=" +this.props.value, {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            if(response.length ==0)
                return;
            this.setState(prev => ({data: response, data_loaded: true, pg_no: prev.pg_no+1}));
        })
        })
    }

    prevPage()
    {
        if(this.state.pg_no <= 1)
            return;
        fetch("http://127.0.0.1:8000/MM_apis/movie_search?page=" + this.state.pg_no-1+ "&name=" +this.props.value, {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            this.setState(prev => ({data: response, data_loaded: true, pg_no: prev.pg_no-1}));
        })
        })
    }

    ratingComp(rating, id){
        if(rating===null)
            return(<React.Fragment></React.Fragment>);
        var indents = [<div key={"rating"+id}>Rating: {rating.toFixed(1)}</div>];    
        rating = Math.floor(rating);    
        for(var i=0; i<rating; i++)
            indents.push(<span className="fa fa-star checked" key={("start"+id)+i}></span>)
        for(var i=0; i<10-rating; i++)
            indents.push(<span className="fa fa-star" key={("start"+id)+rating+i}></span>)
        return indents;
    }

    movieGenresComp(genres, id){
        if(genres.length == 0)
            return(<React.Fragment></React.Fragment>);
        var indents = []; 
        indents.push(<span key={("movie-genre"+id)+i} className="badge badge-secondary"><Link className="MM-link" to={"/moviemania/genres/"+genres[0]["id"]}>{genres[0]["name"]}</Link></span>)
        for(var i=1; i<genres.length && i<3; i++)
            indents.push(<span key={("movie-genre"+id)+i} className="badge badge-secondary"><Link className="MM-link" to={"/moviemania/genres/"+genres[i]["id"]}>{genres[i]["name"]}</Link></span>)
        return indents;
    }

    movieStarsComp(cast, id){
        if(cast.length == 0)
            return(<React.Fragment></React.Fragment>);
        var indents = [<span key={"celebs"+id}>Stars: </span>]; 
        indents.push(<span key={("movie-celebs"+id)+i}><Link to={"/moviemania/celebs_detailed/"+cast[0]["id"]}>{cast[0]["name"]}</Link></span>)
        for(var i=1; i<cast.length && i<3; i++)
            indents.push(<span key={("movie-celebs"+id)+i}><span>, </span><Link to={"/moviemania/celebs_detailed/"+cast[i]["id"]}>{cast[i]["name"]}</Link></span>)
        return indents;
    }

    render(){
        return(
            !this.state.data_loaded?
                <p>Loading...</p>:
                <div>
                    <div className="MM-page-header">
                        <button type="button" className="btn btn-info" id="MM-prev-btn" onClick={() => this.prevPage()}>prev</button>
                        <button type="button" className="btn btn-info" id="MM-next-btn" onClick={() => this.nextPage()}>next</button>
                    </div>
                    <table className="table table-hover">
                        <tbody>
                        {
                            this.state.data.map(
                                (movie, index) =>
                            <tr key={"table row "+movie.id}>
                              <td>
                                <div className="movie_card">
                                  <Link to={"/moviemania/movies_detailed/"+movie.id}>
                                    <img src={"http://127.0.0.1:8000"+movie.display_picture} width="15%" height="60%" className="MM-img"/>
                                  </Link>  
                                  <div className="moviecard-inner">
                                    {(this.state.pg_no - 1)*10 + index+1 }. <Link className="MM-link-dark" to={"/moviemania/movies_detailed/"+movie.id}><b>{movie.name }</b></Link>
                                    {
                                        !movie.release_date?<React.Fragment></React.Fragment>:
                                        <span><span> (</span>
                                        {
                                           movie.release_date.split('-')[0]
                                        }
                                        <span>)</span>   
                                    </span>
                                    }
                                    <div>{this.movieGenresComp(movie.genres, movie.id)}</div>
                                    <div>{this.ratingComp(movie.rating, movie.id)}</div>
                                    <p>{movie.description}</p>
                                    <div>{this.movieStarsComp(movie.cast, movie.id)}</div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
        )
    }
}

class CelebSearchComp extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {pg_no: 1, data:[], data_loaded: false};     
    }
    
    componentDidUpdate(prevProps)
    {
        if(prevProps.value!=this.props.value)
        {
            fetch("http://127.0.0.1:8000/MM_apis/cast_search?page=1&name=" +this.props.value, {
           method: "get", 
            })
            .then( res => {
                res.json()
            .then(response =>{
                this.setState({data: response, data_loaded: true, pg_no: 1});
            })
            })    
        }
    }

    componentDidMount()
    {
        fetch("http://127.0.0.1:8000/MM_apis/cast_search?page=" + this.state.pg_no+ "&name=" +this.props.value, {
           method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            this.setState({data: response, data_loaded: true});
        })
        })
    }

    nextPage()
    {
        fetch("http://127.0.0.1:8000/MM_apis/cast_search?page=" + this.state.pg_no+1+ "&name=" +this.props.value, {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            if(response.length ==0)
                return;
            this.setState(prev => ({data: response, data_loaded: true, pg_no: prev.pg_no+1}));
        })
        })
    }

    prevPage()
    {
        if(this.state.pg_no <= 1)
            return;
        fetch("http://127.0.0.1:8000/MM_apis/cast_search?page=" + this.state.pg_no-1+ "&name=" +this.props.value, {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            this.setState(prev => ({data: response, data_loaded: true, pg_no: prev.pg_no-1}));
        })
        })
    }

    render(){
        return(
            !this.state.data_loaded?
                <p>Loading...</p>:
                <div>
                    <div className="MM-page-header">
                        <button type="button" className="btn btn-info" id="MM-prev-btn" onClick={() => this.prevPage()}>prev</button>
                        <button type="button" className="btn btn-info" id="MM-next-btn" onClick={() => this.nextPage()}>next</button>
                        {
                            this.props.isStaff=="1"?<Link className="btn btn-info" id="MM-add-link" to="/moviemania/celebs/create">Add Celeb</Link>:<React.Fragment></React.Fragment>
                        }
                    </div>
                    <table className="table table-hover">
                        <tbody>
                        {
                            this.state.data.map(
                                (cast, index) =>
                            <tr key={"table row "+cast.id}>
                              <td>
                                <div className="movie_card">
                                {
                                    cast.display_picture==null?<React.Fragment></React.Fragment>:
                                    <Link to={"/moviemania/celebs_detailed/"+cast.id}>
                                      <img src={"http://127.0.0.1:8000"+cast.display_picture} width="23%" height="90%" className="MM-img"/>
                                    </Link>
                                }  
                                  <div className="castcard-inner">
                                    {(this.state.pg_no - 1)*10 + index+1 }. <Link className="MM-link-dark" to={"/moviemania/celebs_detailed/"+cast.id}><b>{cast.name }</b></Link>
                                    {
                                        !cast.born?<React.Fragment></React.Fragment>:
                                        <span><span> (</span>
                                        {
                                           cast.born.split('-')[0]
                                        }
                                        <span>)</span>   
                                    </span>
                                    }
                                    <p>{cast.description}</p>
                                
                                  </div>
                                </div>
                              </td>
                            </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
        )
    }
}

class SearchComp extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {query_parsed: false, type: "", value: ""}   
    }

    queryParser(queryString)
    {
        var type="";
        var value="";
        var tags = queryString.split("&")
        for(var i=0; i<tags.length; i++)
        {
            if(tags[i].startsWith("type="))
            {   
                type=tags[i].split("type=")[1];
            }
            else if(tags[i].startsWith("value="))
            {   
                value=tags[i].split("value=")[1];
                value=value.split("%20").join(" ");
            }
        }
        this.setState({type: type, value: value, query_parsed: true})
    }
    componentDidMount()
    {
        this.queryParser(this.props.location.search.slice(1))
    }
    
    componentDidUpdate(prevProps)
    {
        if(prevProps.location.search!=this.props.location.search)
            this.queryParser(this.props.location.search.slice(1))
    }
    render()
    {
        if(!this.state.query_parsed)
            return <p>Loading...</p>
        if(this.state.type!="movie" && this.state.type!="celeb")
            return <p>Search Query must contain type and it either can be movie or celeb</p>
        if(this.state.value=="")
            return <p>Enter a word or phrase to search on in the form at the top of the page.</p>
        return(
            this.state.type=="movie"?
                <MovieSearchComp value={this.state.value} {...this.props}/>:
                <CelebSearchComp value={this.state.value} {...this.props}/>
        )
    }
}

export default SearchComp;