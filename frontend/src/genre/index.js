import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Link} from "react-router-dom";

class GenreListComp extends Component{
    
    constructor(props)
    {
        super(props)
    }
    render()
    {
        const headStyle ={
            width: '900px',
            color: 'gray',
            backgroundColor: 'black',
            alignContent: 'center'
        }
        return(
            <div>
                <div style={headStyle}>
                    <h3>
                        POPULAR GENRE LIST
                    </h3>
                </div>
                <br/>
                <br/>
                <table className="table">
                    <tbody>
                    <tr>
                        <td><Link to="/moviemania/genres/1"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Crime._CB1513316167_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                        <td><Link to="/moviemania/genres/2"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Action._CB1513316166_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                        <td><Link to="/moviemania/genres/3"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Thriller._CB1513316169_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                    </tr>
                    <tr>
                        <td><Link to="/moviemania/genres/4"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Sci-Fi._CB1513316168_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                        <td><Link to="/moviemania/genres/5"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Comedy._CB1513316168_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                        <td><Link to="/moviemania/genres/6"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Romance._CB1513316168_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                    </tr>
                    <tr>
                        <td><Link to="/moviemania/genres/7"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Horror._CB1513316168_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                        <td><Link to="/moviemania/genres/8"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Fantasy._CB1513316168_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                        <td><Link to="/moviemania/genres/9"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Adventure._CB1513316168_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                    </tr>
                    <tr>
                        <td><Link to="/moviemania/genres/10"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Drama._CB1513316168_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                        <td><Link to="/moviemania/genres/11"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Animation._CB1513316168_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                        <td><Link to="/moviemania/genres/12"><img src="https://m.media-amazon.com/images/G/01/IMDb/genres/Mystery._CB1513316168_SX233_CR0,0,233,131_AL_.jpg"/></Link></td>
                    </tr>
                    </tbody>
                </table>
            </div>
    )}
}

class GenreDetailedComp extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {pg_no: 1, data:[], data_loaded: false, genre_id: this.props.match.params.id};     
    }
    
    componentDidMount()
    {
        fetch(this.props.server_url+"/MM_apis/genre/" + this.state.genre_id + "?page=" + this.state.pg_no, {
           method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            this.setState({data: response, data_loaded: true});
        })
        })
    }

    componentDidUpdate(prevProps)
    {
        
        if(prevProps.match.params.id!=this.props.match.params.id)
        {
            console.log("I am called");
            fetch(this.props.server_url+"/MM_apis/genre/" + this.props.match.params.id + "?page=1", {
                method: "get", 
            })
            .then( res => {
                res.json()
            .then(response =>{
                console
                this.setState({data: response, data_loaded: true, pg_no: 1, genre_id: this.props.match.params.id});
            })
            })    
        }
    }

    nextPage()
    {
        this.setState({data_loaded: false});
        fetch(this.props.server_url+"/MM_apis/genre/" + this.state.genre_id + "?page=" + (this.state.pg_no+1), {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            if(response.movies.length ==0)
                return;
            this.setState(prev => ({data: response, data_loaded: true, pg_no: prev.pg_no+1}));
        }).then(()=>(this.setState({data_loaded: true})))
        })
    }

    prevPage()
    {
        this.setState({data_loaded: false});
        if(this.state.pg_no <= 1)
            return;
        fetch(this.props.server_url+"/MM_apis/genre/" + this.state.genre_id + "?page=" + (this.state.pg_no-1), {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            this.setState(prev => ({data: response, data_loaded: true, pg_no: prev.pg_no-1}));
        }).then(()=>(this.setState({data_loaded: true})))
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
        const headStyle ={
            width: '936px',
            color: 'white',
            backgroundColor: 'black',
            alignContent: 'center'
        }
        return(
            !this.state.data_loaded?
            <div className="loader"></div>:
                <div>
                    <div style={headStyle}>
                        <h3>
                            Top Rated {this.state.data.name} Titles
                        </h3>
                    </div>
                    <div className="MM-page-header">
                        <button type="button" className="btn btn-info" id="MM-prev-btn" onClick={() => this.prevPage()}>prev</button>
                        <button type="button" className="btn btn-info" id="MM-next-btn" onClick={() => this.nextPage()}>next</button>
                    </div>
                    <table className="table table-hover">
                        <tbody>
                        {
                            this.state.data.movies.map(
                                (movie, index) =>
                            <tr key={"table row "+movie.id}>
                              <td>
                                <div className="movie_card">
                                  <Link to={"/moviemania/movies_detailed/"+movie.id}>
                                    <img src={this.props.server_url+movie.display_picture} width="15%" height="60%" className="MM-img"/>
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

export default GenreListComp;
export {GenreDetailedComp};