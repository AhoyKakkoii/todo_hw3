import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import TodoListLinks from './TodoListLinks'

class HomeScreen extends Component {
    handleNewList = () => {
        const fireStore = getFirestore();
        fireStore.collection('todoLists').add({
            items : [],
            name : "",
            owner : "",
            timestamp: fireStore.FieldValue.serverTimestamp()
        })
        .then(ref => {
            this.props.history.push('/todoList/'+ref.id);
        })
        
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <TodoListLinks/>
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            @todo<br />
                            List Maker
                        </div>
                        
                        <div className="home_new_list_container row center">
                                <button className="home_new_list_button " onClick={this.handleNewList}>
                                    Create a New To Do List
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        todoLists: state.firestore.data,
    };
};



export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'todoLists', orderBy: ['timestamp', 'desc'] },
    ]),
)(HomeScreen);