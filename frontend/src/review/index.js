import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Link} from "react-router-dom";

class ReviewList extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {pg_no: 1, movie_id: this.props.match.params.movie_id, movie_data:{}, data:[], data_loaded: false,
            user_reviewed: false, user_review: {}
        };     
    }
    
    readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
      }

    componentDidMount()
    {
        var movie;
        var data;
        fetch(this.props.server_url+"/MM_apis/movies/" + this.state.movie_id, {
           method: "get", })
        .then( res => {
            res.json()
        .then(response =>{
        movie=response;
        fetch(this.props.server_url+"/MM_apis/movies/" + this.state.movie_id +"/reviews?page="+ this.state.pg_no, {
        method: "get", })
        .then( res=> {
            res.json()
        .then(response =>{
            data=response;
            if(this.props.isLoggedIn)
            {
                fetch(this.props.server_url+"/MM_apis/movies/" + this.state.movie_id +"/user_review", {
                    method: "get",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': "JWT "+this.readCookie("JWT")
                    }
                })
                .then( res => {
                    res.json()
                .then( response =>{
                    this.setState({movie_data: movie, data: data, data_loaded: true, user_reviewed: response.reviewed, user_review: response})
                })
                })
            }
            else
            {    
                this.setState({movie_data: movie, data: data, data_loaded: true});
            }
        })
        })
        })
        })
    }

    nextPage()
    {
        fetch(this.props.server_url+"/MM_apis/movies/" + this.state.movie_id +"/reviews?page="+ this.state.pg_no + 1, {
        method: "get", })
        .then( res=> {
            res.json()
        .then(response =>{
            if(response.length == 0)
                return;
            this.setState(prev => ({data: response, data_loaded: true, pg_no: prev.pg_no + 1}));
        })
        })
    }

    prevPage()
    {
        if(this.state.pg_no <= 1)
            return;
        
        fetch(this.props.server_url+"/MM_apis/movies/" + this.state.movie_id +"/reviews?page="+ this.state.pg_no - 1, {
        method: "get", })
        .then( res=> {
            res.json()
        .then(response =>{
            this.setState(prev =>({data: response, data_loaded: true, pg_no: prev.pg_no - 1}));
        })
        })
    }

    ratingComp(rating, id){
        if(rating===null)
            return(<React.Fragment></React.Fragment>);
        var indents = [<div key={"rating"+id}>Rating: {rating.toFixed(1)}</div>];    
        rating = Math.floor(rating);    
        for(var i=0; i<rating; i++)
        {
            indents.push(<span className="fa fa-star checked" key={("start"+id)+i}></span>)
        }
        for(var i=0; i<10-rating; i++)
        {
            indents.push(<span className="fa fa-star" key={("start"+id)+(rating+i)}></span>)
        }
        return indents;
    }

    formatDate(date)
    {
        date = new Date(date);
        return date.toDateString();
    }

    userReviewComp(){
        if(!this.props.isLoggedIn)
            return (<React.Fragment></React.Fragment>)
        if(!this.state.user_reviewed)
            return(
                <tr >
                    <td>
                        <Link to={"/moviemania/add_review/"+this.state.movie_id}>Review the movie</Link>
                    </td>
                </tr>
            )
        return(
        <React.Fragment>
        <tr>
            <td>
                Your Review
            </td>
            <td>
                <Link to={"/moviemania/update_review/"+this.state.movie_id}>Edit Your review</Link>
            </td>
        </tr>
        <tr>
            <td>
                {this.ratingComp(this.state.user_review.rating, 0)}
            </td>
            <td>
                By {this.props.username}
                <br/>
                on: {this.formatDate(this.state.user_review.date)}
            </td>
        </tr>
        {
            !this.state.user_review.description?<React.Fragment></React.Fragment>:
            <tr>
                <td>
                    Description
                </td>
                <td>
                    {this.state.user_review.description}
                </td>
            </tr>
        }
        </React.Fragment>
        )
    }

    render(){
        return(
            !this.state.data_loaded?
            <p>Loading..</p>:
            <div>
                <table className="table">
                  <tbody>
                      <tr>
                          <td>
                          <div className="movie_card">
                                  {!this.state.movie_data.display_picture?<React.Fragment></React.Fragment>:
                                  <Link to={"/moviemania/movies_detailed/"+this.state.movie_data.id}>
                                    <img src={this.props.server_url+this.state.movie_data.display_picture} width="15%" height="60%" className="MM-img"/>
                                  </Link>}  
                                  <div className="moviecard-inner">
                                    <Link className="MM-link-dark" to={"/moviemania/movies_detailed/"+this.state.movie_data.id}><b>{this.state.movie_data.name }</b></Link>
                                    {
                                        !this.state.movie_data.release_date?<React.Fragment></React.Fragment>:
                                        <span><span> (</span>
                                        {
                                           this.state.movie_data.release_date.split('-')[0]
                                        }
                                        <span>)</span>   
                                    </span>
                                    }
                                  <br/>
                                  <br/>
                                  <h4>User reviews</h4>
                                  </div>
                                </div>
                          </td>
                      </tr>
                      {this.userReviewComp()}
                  </tbody>
                </table>
                <br/>
                <br/>
                <hr/>
                <div className="MM-page-header">
                    <button type="button" className="btn btn-info" id="MM-prev-btn" onClick={() => this.prevPage()}>prev</button>
                    <button type="button" className="btn btn-info" id="MM-next-btn" onClick={() => this.nextPage()}>next</button>
                </div>
                <table className="table">
                    <tbody>
                    {this.state.data.map( (review)=>
                          <React.Fragment key={"review-row"+review.id}>
                          <tr >
                              <td>
                                  {this.ratingComp(review.rating, review.id)}
                              </td>
                              <td>
                                  By {review.username}
                                  <br/>
                                  on: {this.formatDate(review.date)}
                              </td>
                          </tr>
                          {
                              !review.description?<React.Fragment></React.Fragment>:
                              <tr >
                                  <td>
                                      Description
                                  </td>
                                  <td>
                                      {review.description}
                                  </td>
                              </tr>
                          }
                          </React.Fragment>
                      )}
                    </tbody>
                </table>
            </div>
        )
    }
}

class CreateReviewComp extends Component
{
    constructor(props)
    {
        super(props);
        this.state={data_loaded: false, reviewed: false, movie_id: this.props.match.params.movie_id, star_rating: 1};
    }

    readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
      }

    componentDidMount()
    {
        fetch(this.props.server_url+"/MM_apis/movies/" + this.state.movie_id +"/user_review", {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Authorization': "JWT "+this.readCookie("JWT")
            }
        })
        .then( res => {
            res.json()
        .then( response =>{
            this.setState({data_loaded: true, reviewed:response.reviewed})
        })
        })
    }

    setRatingStars(rating)
    {
        this.setState({star_rating: rating});
    }

    ratingComp(rating, id){
        if(rating===null)
            return(<React.Fragment></React.Fragment>);
        var indents = [];    
        rating = Math.floor(rating);    
        for(var i=0; i<rating; i++)
        {
            const x=i; //Important to note the difference between const and var, and why we are using local variable
            indents.push(<span onClick={() => this.setRatingStars(x+1)} className="fa fa-star checked" key={("start"+id)+i}></span>)
        }
        for(var i=0; i<10-rating; i++)
        {
            const x=i;
            indents.push(<span onClick={() => this.setRatingStars(rating+x+1)} className="fa fa-star" key={("start"+id)+(rating+i)}></span>)
        }
        return indents;
    }

    create()
    {
        var rating = this.state.star_rating;
        var description = document.getElementById("description_field").value;
        if(description.length>=524)
        {
            alert("The description is too large");
            return;            
        }
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }    

        if(mm<10) {
            mm = '0'+mm
        } 

        today = yyyy + '-' + mm + '-' + dd;
       
        var data ={"rating": rating, "description": description, date: today}
        
        fetch(this.props.server_url+"/MM_apis/movies/" + this.state.movie_id +'/reviews/create', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "JWT "+this.readCookie("JWT")  
                    },
                      body: JSON.stringify(data)
            })
        .then(res => this.props.history.push("/moviemania/reviews/"+this.state.movie_id))
    }
    render()
    {
        if(this.state.reviewed || !this.props.isLoggedIn)
            return (<Redirect to={"/moviemania/reviews/"+this.state.movie_id} />);
        return(
            !this.state.data_loaded? <p>Loading...</p>:
            <div>
                <table className="table table-hover">
                    <tbody>
                    <tr className="table-primary">
                        <td>Rating:</td>
                        <td>{this.ratingComp(this.state.star_rating)}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td>Description</td>
                        <td>
                            <textarea className="form-control" rows="3" id="description_field" placeholder="description"></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button type="button" className="btn btn-info" onClick={() => this.create()}>Add review</button>
            </div>
        );
    }
}

class EditReviewComp extends Component
{
    constructor(props)
    {
        super(props);
        this.state={data_loaded: false, reviewed: true, movie_id: this.props.match.params.movie_id, star_rating: 1};
    }

    readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
      }

    componentDidMount()
    {
        fetch(this.props.server_url+"/MM_apis/movies/" + this.state.movie_id +"/user_review", {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Authorization': "JWT "+this.readCookie("JWT")
            }
        })
        .then( res => {
            res.json()
        .then( response =>{
            if(response.reviewed)
                this.setState({data_loaded: true, reviewed:true, data: response, star_rating: response.rating})
            else
                this.setState({data_loaded: true, reviewed:false})
        })
        })
    }

    setRatingStars(rating)
    {
        this.setState({star_rating: rating});
    }

    ratingComp(rating, id){
        if(rating===null)
            return(<React.Fragment></React.Fragment>);
        var indents = [];    
        rating = Math.floor(rating);    
        for(var i=0; i<rating; i++)
        {
            const x=i; //Important to note the difference between const and var, and why we are using local variable
            indents.push(<span onClick={() => this.setRatingStars(x+1)} className="fa fa-star checked" key={("start"+id)+i}></span>)
        }
        for(var i=0; i<10-rating; i++)
        {
            const x=i;
            indents.push(<span onClick={() => this.setRatingStars(rating+x+1)} className="fa fa-star" key={("start"+id)+(rating+i)}></span>)
        }
        return indents;
    }

    update()
    {
        var rating = this.state.star_rating;
        var description = document.getElementById("description_field").value;
        if(description.length>=524)
        {
            alert("The description is too large");
            return;            
        }
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        }    

        if(mm<10) {
            mm = '0'+mm
        } 

        today = yyyy + '-' + mm + '-' + dd;
       
        var data ={"rating": rating, "description": description, date: today}
        
        fetch(this.props.server_url+"/MM_apis/movies/" + this.state.movie_id +'/user_review/update', {
                    method: 'put',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': "JWT "+this.readCookie("JWT")  
                    },
                      body: JSON.stringify(data)
            })
        .then(res => {
            if(res.status==201)
                this.props.history.push("/moviemania/reviews/"+this.state.movie_id)
            else
                res.json()
                .then(response => console.log(response))
        })
    }
    render()
    {
        if(!this.state.reviewed || !this.props.isLoggedIn)
            return (<Redirect to={"/moviemania/reviews/"+this.state.movie_id} />);
        return(
            !this.state.data_loaded? <p>Loading...</p>:
            <div>
                <table className="table table-hover">
                    <tbody>
                    <tr className="table-primary">
                        <td>Rating:</td>
                        <td>{this.ratingComp(this.state.star_rating)}</td>
                    </tr>
                    <tr className="table-secondary">
                        <td>Description</td>
                        <td>
                            <textarea className="form-control" rows="3" id="description_field" defaultValue={this.state.data.description} placeholder="description"></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button type="button" className="btn btn-info" onClick={() => this.update()}>update review</button>
            </div>
        );
    }
}

export default ReviewList;
export {CreateReviewComp, EditReviewComp};