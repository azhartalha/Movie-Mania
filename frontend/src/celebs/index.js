import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Link} from "react-router-dom";

class CastListComp extends Component{
    constructor(props)
    {
        super(props);
        this.state = {pg_no: 1, data:[], data_loaded: false};     
    }
    
    componentDidMount()
    {
        fetch(this.props.server_url + "/MM_apis/cast?page=" + this.state.pg_no, {
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
        this.setState({data_loaded: false});
        fetch(this.props.server_url + "/MM_apis/cast?page=" + (this.state.pg_no+1), {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            if(response.length ==0)
                return;
            this.setState(prev => ({data: response, pg_no: prev.pg_no+1}));
        }).then(()=>(this.setState({data_loaded: true})))
        })
    }

    prevPage()
    {
        if(this.state.pg_no <= 1)
            return;
        this.setState({data_loaded: false});
        fetch(this.props.server_url + "/MM_apis/cast?page=" + (this.state.pg_no-1), {
            method: "get", 
        })
        .then( res => {
            res.json()
        .then(response =>{
            this.setState(prev => ({data: response, pg_no: prev.pg_no-1}));
        }).then(()=>(this.setState({data_loaded: true})))
        })
    }

    render(){
        return(
            !this.state.data_loaded?
            <div class="loader"></div>:
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
                                      <img src={this.props.server_url+cast.display_picture} width="23%" height="90%" className="MM-img"/>
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

class AddCelebComp extends Component{
    constructor(props)
    {
        super(props);
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

    create()
    {
        const name = document.getElementById("name_field").value;
        const date = document.getElementById("release_date_field").value;
        const picture = document.getElementById("display_picture_file").files[0];
        const description = document.getElementById("description_field").value;
        if(name=="")
        {
            alert("Name field cannot be empty");
            return;
        }
        if(picture && picture.size> 5e+6)
        {
            alert("The file is too large");
            return;
        }
        if(description.length>=256)
        {
            alert("The description is too large");
            return;            
        }
        var data = new FormData();
        data.append('name', name);
        data.append('description', description);
        
        if(picture)
            data.append("display_picture", picture);
        
        if(date)
            data.append("born", date);

        fetch(this.props.server_url+"/MM_apis/cast/create", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Authorization': "JWT "+this.readCookie("JWT")
            },
              body: data
        })
        .then(res => {
            if(res.status==201)
            {
                res.json()
                .then(response => this.props.history.push("/moviemania/celebs_detailed/"+response.id))
            }
            else if(res.status==400)
            {
                res.json()
                .then(response => {
                    if("message" in response)
                        alert("Celeb already exists with the same name");
                    else
                        {
                            alert("Please check the file format");
                            console.log(response);
                        }
                })
            }
        })
    }

    render(){
        return(
            this.props.isStaff!="1"?
            <Redirect to="/moviemania/celebs"/>:
            <div>
            <table className="table table-hover">
            <tbody>
                <tr>
                    <td>
                        Celeb Name
                    </td>
                    <td>
                        <input className="form-control mr-sm-2" type="text" id="name_field" placeholder="name *"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Date of Brith
                    </td>
                    <td>
                        <input type="date" id="release_date_field"/><br/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Display picture
                    </td>
                    <td>
                        <input type="file" id="display_picture_file"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Celeb description
                    </td>
                    <td>
                        <textarea className="form-control" rows="3" id="description_field" placeholder="description"></textarea>
                    </td>
                </tr>
            </tbody>
            </table>
            <button type="button" className="btn btn-info" onClick={() => this.create()}>create</button>
            </div>
        )
    }
}

class UpdateCelebComp extends Component{
    constructor(props)
    {
        super(props);
        this.state ={data_loaded: false, data: {}, cast_id: props.match.params.id};
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
        fetch(this.props.server_url + "/MM_apis/cast/"+this.state.cast_id , {
           method: "get",
           headers: {
            'Authorization': "JWT "+this.readCookie("JWT")
          } 
        })
        .then( res => {
        if(res.status == 200)
             res.json()
            .then(response => {
                this.setState({data_loaded: true, data: response})
            })
        })
    }

    update()
    {
        const name = document.getElementById("name_field").value;
        const date = document.getElementById("release_date_field").value;
        const picture = document.getElementById("display_picture_file").files[0];
        const description = document.getElementById("description_field").value;
        if(name=="")
        {
            alert("Name field cannot be empty");
            return;
        }
        if(picture && picture.size> 5e+6)
        {
            alert("The file is too large");
            return;
        }
        if(description.length>=256)
        {
            alert("The description is too large");
            return;            
        }
        var data = new FormData();
        data.append('name', name);
        data.append('description', description);
        
        if(picture)
            data.append("display_picture", picture);
        
        if(date)
            data.append("born", date);

        fetch(this.props.server_url+"/MM_apis/cast/"+this.state.cast_id+"/update", {
            method: "put",
            headers: {
                'Accept': 'application/json',
                'Authorization': "JWT "+this.readCookie("JWT")
            },
              body: data
        })
        .then(res => {
            if(res.status==201)
            {
                res.json()
                .then(response => this.props.history.push("/moviemania/celebs_detailed/"+response.id))
            }
            else
            {
                res.json()
                .then(response => console.log(response))
            }
        })
    }

    render(){
        if(this.props.isStaff=="1")
        return(
            !this.state.data_loaded?
            <p>Loding...</p>:
            <div>
            <table className="table table-hover">
            <tbody>
                <tr>
                    <td>
                        Celeb Name
                    </td>
                    <td>
                        <input className="form-control mr-sm-2" type="text" id="name_field" defaultValue={this.state.data.name} placeholder="name *"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Date of Brith
                    </td>
                    <td>
                        <input type="date" defaultValue={this.state.data.born} id="release_date_field"/><br/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Display picture
                    </td>
                    <td>
                        <input type="file" id="display_picture_file"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        Celeb description
                    </td>
                    <td>
                        <textarea className="form-control" rows="3" defaultValue={this.state.data.description} id="description_field" placeholder="description"></textarea>
                    </td>
                </tr>
            </tbody>
            </table>
            <button type="button" className="btn btn-info" onClick={() => this.update()}>update</button>
            </div>
        )
        else
        return <Redirect to="/moviemania/celebs"/>
    }
}


class CelebDetailedComp extends Component
{
    constructor(props)
    {
        super(props);
        this.state ={data_loaded: false, data: {}, cast_id: props.match.params.id};
    }

    componentDidMount()
    {
        fetch(this.props.server_url+"/MM_apis/cast/"+this.state.cast_id, {
            method: "get", 
        })
        .then( res => {
            if(res.status == 200)
                 res.json()
                .then(response => {
                    this.setState({data_loaded: true, data: response})
            })
        })
    }

    formatDate(date)
    {
        date = new Date(date);
        return date.toDateString();
    }

    filmatograpyComp(movies){
        if(movies.length===0)
            return(<React.Fragment></React.Fragment>)
        return(
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>
                            Filmography
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        movies.map((movie, index) =>(
                            index%2?
                            <tr className="table-primary" key={"cast-movie"+movie.id}>
                                <td><Link className="empty-div" to={"/moviemania/movies_detailed/"+movie.id}>{movie.name}</Link></td>
                                <td>{movie.release_date.split("-")[0]}</td>
                            </tr>:
                            <tr className="table-secondary" key={"cast-movie"+movie.id}>
                                <td><Link className="empty-div" to={"/moviemania/movies_detailed/"+movie.id}>{movie.name}</Link></td>
                                <td>{movie.release_date.split("-")[0]}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }

    render()
    {
        return(
            !this.state.data_loaded? <div class="loader"></div>:
            <div>
                {
                    this.props.isStaff!=1?<React.Fragment></React.Fragment>: 
                    <div>
                      <Link to={"/moviemania/celebs_detailed/"+this.state.cast_id+"/update"} id="edit-movie-div">update celeb</Link>
                    </div>
                }
                <div className="detailed">
                  <hr/><h3>{this.state.data.name}</h3><hr/>
                  <div className="detail-media-div">
                    <img src={this.props.server_url+this.state.data.display_picture} className="alignleft" width="200" height="300"/>
                    <div>
                        <br/>
                        {this.state.data.description}
                        <br/>
                        <br/>
                        <div>Born:  {this.formatDate(this.state.data.born)}</div>
                    </div>
                  </div>
                  <br/>
                  <br/>
                  {this.filmatograpyComp(this.state.data.movies)}
                </div>
            </div>
        );
    }
}
export default CastListComp;
export {AddCelebComp, UpdateCelebComp, CelebDetailedComp};